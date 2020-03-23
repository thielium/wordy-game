#!/usr/local/bin/python3

import logging
import json
import re

MIN_WORD_LENGTH = 3
FREQ_WORDS_TO_REMOVE = ['the', 'aaa', 'aam', 'abc', 'anti', 'are', 'may']
DICT_WORDS_TO_REMOVE = [
    'DOES', 'ETHNIC', 'HOLDER',
    'ITS', 'LIT', 'NAM', 'NAT', 'NOT', 'REDUCING',
]
WORD_TYPES_TO_SKIP = set(['conj.', 'pron.', 'prep.'])
TYPE_SUM_MINIMUM = 100
path_words_by_freq = '/Users/bfrisbie/Downloads/_PERMANENT/wordy_game/google-10000-english.txt'
path_websters_dict = '/Users/bfrisbie/Downloads/_PERMANENT/wordy_game/pg29765.txt'


class Word:

    def __init__(self, spelling):
        self.uppercase = spelling.upper()
        self.types = None
        self.type_count = 0

    def __str__(self):
        answer = type(self).__name__ + '('
        for k, v in self.__dict__.items():
            answer += '{}: {}, '.format(k, v)
        return answer + ')'

    def __repl__(self):
        return self.__str__()


def get_replace_args():
    return (
        ('CONSOLATION GAME; CONSOLATION MATCH; CONSOLATION POT; CONSOLATION\nRACE\n', '', 1),

        ('A*long". Etym', 'A*long", adv. Etym', 1),
        ('Bib`li*og"ra*phy n.;', 'Bib`li*og"ra*phy, n.;', 1),
        ('Broke (brok),', 'Broke (brok), v.', 1),
        ('Cab"in v. i.', 'Cab"in, v. i.', 1),
        ('Can"dy n.', 'Can"dy, n.', 1),
        ('Car"di*ac n.', 'Car"di*ac, n.', 1),
        ('Cau"tion v. t.', 'Cau"tion, v. t.', 1),
        ('Crew (kr),', 'Crew (kr), n.', 3),
        ('Crown (krn),', 'Crown (krn), n.', 1),
        ('Cult (klt) n .', 'Cult (klt), n.', 1),
        ('Duke n.', 'Duke, n.', 1),
        ('E"ven n.', 'E"ven, n.', 1),
        ('E"vil n.', 'E"vil, n.', 1),
        ('Ex*clu"sive a. Etym', 'Ex*clu"sive, a. Etym', 1),
        ('Ex*cite"ment n.', 'Ex*cite"ment, n.', 1),
        ('Fail v. i. [imp.', 'Fail, v. i. [imp.', 1),
        ('Gear v. t.', 'Gear, v. t.', 1),
        ('Gem v. t.', 'Gem, v. t.', 1),
        ('Heat, Etym', 'Heat, n. Etym', 1),
        ('Hit adj.', 'Hit, adj.', 1),
        ('Lei"sure n.', 'Lei"sure, n.', 1),
        ('Mak"er (mak"er) n.,', 'Mak"er (mak"er), n.,', 1),
        ('Med`i*ca"tion, Etym', 'Med`i*ca"tion, n. Etym', 1),
        ('Na"vy; n.;', 'Na"vy, n.;', 1),
        ('Me"sa, Etym', 'Me"sa, n. Etym, [Sp.]', 1),
        ('O"pen v. t.', 'O"pen, v. t.', 1),
        ('Oth"er conj. Etym', 'Oth"er, conj. Etym', 1),
        ('Ox"y*gen n.', 'Ox"y*gen, n.', 1),
        ('Par"tial*ly adv.', 'Par"tial*ly, adv.', 1),
        ('Peer v. t.', 'Peer, v. t.', 2),
        ('Pro"ceed n.', 'Pro"ceed, n.', 1),
        ('Pro*ceed" v. i. [imp.', 'Pro*ceed", v. i. [imp.', 1),
        ('Pulled a.', 'Pulled, a.', 1),
        ('Re*flect" v. i.', 'Re*flect", v. i.', 1),
        ('Re*main" n.', 'Re*main", n.', 1),
        ('Sal"a*ry v. t.', 'Sal"a*ry, v. t.', 1),
        ('Vis"it*or. Etym', 'Vis"it*or, n. Etym', 1),
        ('Wom"an n.;', 'Wom"an, n.;', 1),
    )


def map_word_to_types(words_alphabetized):
    with open(path_websters_dict, 'r') as fh:
        dict_contents = fh.read()

    for args in get_replace_args():
        dict_contents = dict_contents.replace(*args)

    i = 0
    next_line_has_type = False
    word_to_type_map = {}

    for line in dict_contents.split('\n'):
        if not line.strip():
            continue
        if next_line_has_type:
            # Below only applies to verb tenses, e.g.: Vis"it*ing,
            if ' ' not in line:
                word_types = None
                logging.info('Skipping: {}'.format(line))
            else:
                if 'Etym:' in line:
                    line = line.split('Etym:')[0]
                # parse_line
                re_results = re.search(', ([^[^E^(^)^;^,]+)', line)
                
                if re_results and re_results.groups():
                    word_types = re_results.groups()[0].strip()
                else:
                    word_types = 'FAILED_PARSE'
                    logging.warning('Failed to parse line following "{}": {}'.format(
                        words_alphabetized[i], line))
            
            if word_types:
                if '&' in word_types:
                    word_types = (wt.strip() for wt in word_types.split('&'))
                elif ' or ' in word_types:
                    word_types = (wt.strip() for wt in word_types.split(' or '))
                else:
                    word_types = [word_types]

                if words_alphabetized[i] not in word_to_type_map:
                    word_to_type_map[words_alphabetized[i]] = set(word_types)
                else:
                    [word_to_type_map[words_alphabetized[i]].add(wt) for wt in word_types]
            next_line_has_type = False
        # A line in the dictionary indicates the start of a new word if it is in ALL CAPS
        elif len(line) >= MIN_WORD_LENGTH and line[0].isalpha() and ' ' not in line \
                and '.' not in line and line.upper() == line:  # Can make more efficient
            if line in DICT_WORDS_TO_REMOVE:
                continue

            logging.debug('{} > {} | {}'.format(line, words_alphabetized[i], line > words_alphabetized[i]))
            # Case: words_alphabetized[i] not found :/
            while line > words_alphabetized[i]:
                if words_alphabetized[i] not in word_to_type_map:
                    word_to_type_map[words_alphabetized[i]] = None
                i += 1
                if i >= len(words_alphabetized):
                    return word_to_type_map

            if words_alphabetized[i] == line:
                next_line_has_type = True
                continue
    return word_to_type_map


def print_word_freq_with_type(words_by_freq, word_to_type_map):
    for word in words_by_freq:
        print('{} | {}'.format(word, word_to_type_map.get(word.upper(), None)))
    print('==================================')

def print_word_type_counts(word_to_type_map):
    type_counts = {}
    for types in word_to_type_map.values():
        if not types:
            continue
        for t in types:
            if t in type_counts:
                type_counts[t] += 1
            else:
                type_counts[t] = 1
    
    print(json.dumps(type_counts, indent=4))


def get_type_count(word_to_types_map):
    type_counts = {}
    for types in word_to_types_map.values():
        if not types:
            continue
        for t in types:
            if t in type_counts:
                type_counts[t] += 1
            else:
                type_counts[t] = 1
    return type_counts


def print_info(words_by_freq):
    for w in words_by_freq:
        if w.types is None or w.type_count < TYPE_SUM_MINIMUM or len(WORD_TYPES_TO_SKIP.intersection(w.types)):
            print('\tSKIPPING: {} | {} | {}'.format(w.uppercase.lower(), w.types, w.type_count))
        else:
            print('{} | {} | {}'.format(w.uppercase.lower(), w.types, w.type_count))


def main():
    with open(path_words_by_freq, 'r') as fh:
        words_by_freq = [line.strip() for line in fh.readlines() if len(line.strip()) >= MIN_WORD_LENGTH]
    # Manually remove frequent words
    words_by_freq = [Word(w) for w in words_by_freq if w not in FREQ_WORDS_TO_REMOVE]

    words_alphabetized = sorted([w.uppercase for w in words_by_freq])
    word_to_types_map = map_word_to_types(words_alphabetized)
    type_counts = get_type_count(word_to_types_map)

    for word in words_by_freq:
        word.types = word_to_types_map.get(word.uppercase, None)
        if word.types:
            word.type_count = sum(type_counts[t] for t in word.types)
    print_info(words_by_freq)


if __name__ == '__main__':
    main()
