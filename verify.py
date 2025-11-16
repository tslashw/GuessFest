import json
from collections import Counter

def main():
    # Read dataset:
    data = read_json("items.json")

    # Pull categories (dict keys):
    categories = list(data.keys())

    # Flatten JSON data:
    data_flat = []
    for c in categories:
        for x in data[c]:
            data_flat.append(x)

    
    print(f"Total Items: {len(data_flat)}\n")

    count = Counter(data_flat)

    duplicates = []
    for n in count:
        if count[n] > 1:
            duplicates.append(n)

    print(f"There are {len(duplicates)} duplicates in the dataset")
    for d in duplicates: print(d)
    print()

    sort_input = input("Would you like to sort the dataset alphabetically? (y/n)\n>")

    if sort_input in ["y", "Y", "yes"]:
        data_sorted = {}
        for c in categories:
            data_sorted[c] = sorted(data[c])

        write_json("items.json", data_sorted)

        print("JSON file successfully sorted...")



def read_json(path):
    try:
        with open(path, "r") as stream:
            data = json.load(stream)
            return data
    except IOError as e:
        print(f"Failed to open file '{path}':\n{e}")
    except (ValueError, json.JSONDecodeError, AttributeError) as e:
        print(f"Failed to read JSON stream:\n{e}")


def write_json(path, output):
    with open(path, "w") as stream:
        stream.write(json.dumps(output))


if __name__ == "__main__":
    main()