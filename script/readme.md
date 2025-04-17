# Snappy.Cards URL Generator

This Bash script generates a Snappy.Cards URL based on user input. The script reads parameters from a `params.txt` file, prompts the user for input, and stores the information in a specified file (default is `card.txt`). The script also allows users to clear stored values by entering `-`.

## Features

- Prompts the user for various details to generate a Snappy.Cards URL.
- Stores user input in a specified file for future use.

## Prerequisites

- Bash shell
- `params.txt` file with the required parameters

## Usage

**Ensure `params.txt` is correctly formatted:**

```plaintext
name=Your name or headline.
job=Your position in your company or job title.
phone=A phone number. This line is prefixed with a phone symbol.
mail=A mail address. This line is prefixed with a mail symbol.
web=A web address. This line is prefixed with a globe symbol.
sub=A watermark shown on the bottom of the card. Can be any sort of text.
avatar=This is the avatar image on the card. Options: snappy:<000>.jpeg, Image URL, empty, random, Unsplash Image.
background=This is the background image of the card. Options: snappy:<000>.jpeg, Image URL, empty, random, Unsplash Image.
twt=Your handle on Twitter (deprecated, use "x" instead).
x=Your handle on X (formerly known as Twitter).
fb=Your handle on Facebook.
yt=Your handle on YouTube.
in=Your handle on Instagram.
twc=Your handle on Twitch.
gh=Your handle on GitHub.
li=Your handle on LinkedIn.
xi=Your handle on Xing.
pp=Your handle for PayPal.me.
pa=Your handle on Patreon.
pi=Your handle on Pinterest.
npm=Your handle on npmjs.com.
sc=Your handle on SoundCloud.
sn=Your handle on Snapchat.
st=Your handle on Steam.
mc=Your handle on metacpan.
sgn=Your handle on Signal.
tel=Your handle on Telegram.
cfgMaxDetails=Configuration option to determine how many detail lines are shown. Default is to display all detail lines.
```

**Convert line endings to LF (if necessary):**

```bash
dos2unix params.txt
```

Alternatively, use `sed`:

```bash
sed -i 's/\r$//' params.txt
```

**Make the script executable:**

```bash
chmod +x generate_card.sh
```

**Run the script:**

```bash
./generate_card.sh [optional_file_name] [--view]
```

- If you provide an optional file name as an argument, the script will use that file name with the .txt extension to store the information.
- If no file name is provided, it will default to card.txt.
- If --view is provided, the script will only show the URI with all the stored data without prompting for input.

## Example

```bash
./generate_card.sh my_card
```

This will use `my_card.txt` to store the information.


## License

This project is licensed under the MIT License.
