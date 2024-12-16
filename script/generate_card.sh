#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e
# Treat unset variables as an error
set -u
# Pipefail option ensures that the script exits if any command in a pipeline fails
set -o pipefail

# Function to URL encode a string
urlencode() {
    local length="${#1}"
    local c
    for (( i = 0; i < length; i++ )); do
        c="${1:i:1}"
        case $c in
            [a-zA-Z0-9.~_-]) printf "%s" "$c" ;;
            *) printf '%%%02X' "'$c" ;;
        esac
    done
}

# Function to append parameter to URL if not empty
append_param() {
    local param_name="$1"
    local param_value="$2"
    if [ -n "$param_value" ]; then
        local encoded_value
        encoded_value=$(urlencode "$param_value")
        url="${url}&${param_name}=${encoded_value}"
    fi
}

# Default file name
file_name="card"
show_uri_only=false

# Check if a file name parameter or --view is provided
for arg in "$@"; do
    case $arg in
        --view)
            show_uri_only=true
            shift
            ;;
        *)
            file_name="$arg"
            shift
            ;;
    esac
done

# Add the .txt extension to the file name
file_name="${file_name}.txt"

# Initialize URL
url="https://snappy.cards/#"

# Create a temporary file to store updated user info
temp_file=$(mktemp)

# Ensure the temporary file is removed on exit
trap 'rm -f "$temp_file"' EXIT

# Check if params.txt exists
if [ ! -f params.txt ]; then
    echo "Error: params.txt file not found!"
    exit 1
fi

# Open params.txt using a file descriptor
exec 3< params.txt

# Read parameters from text file using the file descriptor
while IFS='=' read -r key prompt <&3; do
    # Skip empty lines
    [ -z "$key" ] && continue

    # Check if the file exists and read value from it
    default_value=""
    if [ -f "$file_name" ]; then
        default_value=$(grep "^$key=" "$file_name" | cut -d'=' -f2- || true)
    fi

    # If --show-uri is provided, skip prompting and just append the parameter
    if [ "$show_uri_only" = true ]; then
        append_param "$key" "$default_value"
        continue
    fi

    # Determine the prompt message
    if [ -n "$default_value" ]; then
        prompt_message="$prompt\n[$default_value] ('-' to remove): "
    else
        prompt_message="$prompt: "
    fi

    # Prompt the user with the default value and hint to clear the value
    printf "%b" "$prompt_message"
    read -r value

    # If the user enters "-", remove the value
    if [ "$value" == "-" ]; then
        value=""
    else
        value=${value:-$default_value}
    fi

    # Save the updated value to the temporary file
    printf "%s=%s\n" "$key" "$value" >> "$temp_file"

    append_param "$key" "$value"
done

# Close the file descriptor
exec 3<&-

# If --show-uri is not provided, replace the old file with the updated one
if [ "$show_uri_only" = false ]; then
    mv "$temp_file" "$file_name"
fi

# Output the URL
printf "Your Snappy.Cards URL is:\n%s\n" "${url#&}"
