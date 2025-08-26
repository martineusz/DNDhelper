import re
import sys
import os


def remove_comments(file_path):
    """Removes comments from a single Python file."""
    try:
        if not file_path.endswith('.py'):
            print(f"Skipping non-Python file: {file_path}")
            return

        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Remove multi-line comments (triple quotes)
        content = re.sub(r'\'\'\'.*?\'\'\'|""".*?"""', '', content, flags=re.DOTALL)

        # Remove single-line comments
        content = re.sub(r'#.*$', '', content, flags=re.MULTILINE)

        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content.strip())

        print(f"Comments removed from {file_path}")

    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
    except Exception as e:
        print(f"An error occurred with file {file_path}: {e}")


def process_path(path):
    """Processes either a single file or a directory recursively."""
    if os.path.isfile(path):
        remove_comments(path)
    elif os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                file_path = os.path.join(root, file)
                remove_comments(file_path)
    else:
        print(f"Error: Path '{path}' is not a valid file or directory.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python remove_comments.py <path_to_file_or_directory>")
    else:
        process_path(sys.argv[1])