import re

def analyze_name(name):
    # Regular expression to find the first name, middle name (if any),
    # first last name, and second last name (if any)
    pattern = re.compile(r'^(\w+)(?:\s+(\w+))?(\s+\w+)(?:\s+(\w+))?$')

    name_split = name.split(" ")

    if len(name_split) > 4:
        name = f"{name_split[0]} {name_split[1]} {name_split[2]} {name_split[3]}"

    print(name)

    match = pattern.match(name)

    if match:
        first_name = match.group(1)
        middle_name = match.group(2)
        first_last_name = match.group(3)
        second_last_name = match.group(4)

        # Check if middle name and second last name are present
        if middle_name and second_last_name:
            return {
                "first_name": first_name.strip(),
                "middle_name": middle_name.strip(),
                "last_name": first_last_name.strip(),
                "last_name_2": second_last_name.strip()
            }

        elif middle_name:
            return {
                "first_name": first_name.strip(),
                "middle_name": middle_name.strip(),
                "last_name": first_last_name.strip(),
                "last_name_2": ""
            }

        else:
            return {
                "first_name": first_name.strip(),
                "middle_name": "",
                "last_name": first_last_name.strip(),
                "last_name_2": ""
            }
    else:
        return False