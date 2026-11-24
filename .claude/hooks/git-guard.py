#!/usr/bin/env python3
"""PreToolUse hook: enforce the git workflow (docs/company/git-workflow.md).

Blocks, with a reason the agent can act on:
- file edits inside the repository while not on a `<type>/<short-description>` branch,
- creating a branch with a name that does not follow `<type>/<short-description>`,
- commits on a wrong branch, with a message that is not `<type>: <summary>`,
  or with attribution trailers / links to AI sessions,
- pushes from a wrong branch or to `main`.

Exit code 2 blocks the tool call and shows stderr to the agent.
"""
import json
import os
import re
import shlex
import subprocess
import sys

TYPES = "feat|fix|docs|chore|refactor|test|style|perf"
BRANCH_RE = re.compile(rf"^({TYPES})/[a-z0-9][a-z0-9._-]*$")
SUBJECT_RE = re.compile(rf"^({TYPES}): \S")
FORBIDDEN = [
    (re.compile(r"(?im)^co-authored-by:.*(claude|anthropic|copilot|gpt)"), "an AI `Co-Authored-By` trailer"),
    (re.compile(r"(?im)^claude-session:"), "a session trailer"),
    (re.compile(r"(?i)claude\.ai/(code|chat)"), "a link to an AI session"),
    (re.compile(r"(?i)generated (with|by) "), "a 'Generated with/by' line"),
]
WORKFLOW = "docs/company/git-workflow.md"


def block(reason):
    print(f"Blocked by git-guard: {reason} See {WORKFLOW}.", file=sys.stderr)
    sys.exit(2)


def git(args, cwd):
    try:
        out = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, timeout=5)
    except (OSError, subprocess.SubprocessError):
        return None
    return out.stdout.strip() if out.returncode == 0 else None


def check_branch_name(name, what):
    if not BRANCH_RE.match(name):
        block(f"{what} `{name}` is not `<type>/<short-description>` (types: {TYPES.replace('|', ', ')}).")


def check_current_branch(cwd, action):
    branch = git(["branch", "--show-current"], cwd)
    if branch is None:
        return  # not a git repository
    if branch in ("", "main"):
        block(f"{action} on `{branch or 'detached HEAD'}`. First create a topic branch: "
              "`git fetch origin main && git checkout -b <type>/<short-description> origin/main`.")
    check_branch_name(branch, f"{action} on branch")


def check_message(msg):
    subject = msg.strip().splitlines()[0] if msg.strip() else ""
    if not SUBJECT_RE.match(subject):
        block(f"commit subject `{subject}` is not `<type>: <summary>`.")
    for pattern, label in FORBIDDEN:
        if pattern.search(msg):
            block(f"the commit message contains {label} (see the *No private links* rule in AGENTS.md).")


def split_heredocs(command):
    """Return the command without heredoc bodies, and the bodies."""
    bodies = []
    pattern = re.compile(r"<<-?\s*(['\"]?)(\w+)\1[^\n]*\n(.*?)\n\s*\2\b", re.S)

    def repl(m):
        bodies.append(m.group(3))
        return "<<HEREDOC "

    return pattern.sub(repl, command), bodies


def git_invocations(command):
    """Yield the argument lists of git commands in a (compound) shell command."""
    lexer = shlex.shlex(command, posix=True, punctuation_chars="();<>|&\n")
    lexer.whitespace = " \t\r"
    lexer.whitespace_split = True
    try:
        tokens = list(lexer)
    except ValueError:  # unbalanced quotes: let the shell report it
        return
    segment = []
    for token in tokens + [";"]:
        if token and set(token) <= set("();|&\n"):
            if "git" in segment:
                args = segment[segment.index("git") + 1:]
                while args and args[0] in ("-C", "-c"):  # global options with a value
                    args = args[2:]
                if args:
                    yield args
            segment = []
        else:
            segment.append(token)


def check_bash(command, cwd):
    stripped, bodies = split_heredocs(command)
    for args in git_invocations(stripped):
        sub, rest = args[0], args[1:]
        if sub in ("checkout", "switch") and any(f in rest for f in ("-b", "-B", "-c", "-C")):
            for flag in ("-b", "-B", "-c", "-C"):
                if flag in rest and rest.index(flag) + 1 < len(rest):
                    check_branch_name(rest[rest.index(flag) + 1], "new branch")
        elif sub == "worktree" and rest[:1] == ["add"] and "-b" in rest:
            i = rest.index("-b")
            if i + 1 < len(rest):
                check_branch_name(rest[i + 1], "new branch")
        elif sub == "branch" and rest and not rest[0].startswith("-"):
            check_branch_name(rest[0], "new branch")
        elif sub == "commit":
            check_current_branch(cwd, "committing")
            messages = [rest[i + 1] for i, a in enumerate(rest[:-1]) if a in ("-m", "--message")]
            messages += [a.split("=", 1)[1] for a in rest if a.startswith("--message=")]
            if any("<<HEREDOC" in m or "$(" in m for m in messages) or (not messages and bodies and "-F" in rest):
                messages = bodies[:1]
            if messages:
                check_message("\n\n".join(messages))
        elif sub == "push":
            check_current_branch(cwd, "pushing")
            for a in rest:
                if a == "main" or a.endswith(":main") or a.endswith(":refs/heads/main"):
                    block("pushing to `main` is not allowed.")


def check_edit(path, cwd):
    path = os.path.abspath(os.path.join(cwd, path))
    directory = os.path.dirname(path)
    while directory and not os.path.isdir(directory):
        directory = os.path.dirname(directory)
    top = git(["rev-parse", "--show-toplevel"], directory)
    if top is None or "/.git/" in path:
        return  # outside any repository (e.g. a scratchpad)
    check_current_branch(directory, "editing files")


def main():
    try:
        data = json.load(sys.stdin)
    except ValueError:
        return
    tool = data.get("tool_name", "")
    tool_input = data.get("tool_input") or {}
    cwd = data.get("cwd") or os.getcwd()
    if tool == "Bash":
        check_bash(tool_input.get("command", ""), cwd)
    elif tool in ("Edit", "Write", "MultiEdit", "NotebookEdit"):
        path = tool_input.get("file_path") or tool_input.get("notebook_path")
        if path:
            check_edit(path, cwd)


if __name__ == "__main__":
    main()
