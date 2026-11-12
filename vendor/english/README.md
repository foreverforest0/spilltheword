# Local English spelling and family data

Derived from the environment's Hunspell `en_US.dic` and `en_US.aff` (SCOWL).
`LICENSE-SCOWL.txt` preserves the original notices and redistribution terms.

`lexicon.json` contains lowercase alphabetic entries, their source affix flags and
rules, and spellings expanded using permitted affixes/cross-products. Generated
expansions are checked with libhunspell. `lexicon.json.gz` is the same JSON with
deterministic gzip compression. These are modified, generated data, not verbatim
copies of the source dictionary. Source SHA-256 is embedded in the data.

WordNet 3.0 derivational and pertainym pointers provide 16,389 mapped joins,
50,075 part-of-speech entries and person-noun classifications. Only endpoints
in the spelling dictionary and relations mapped to supported changes are kept.
`LICENSE-WORDNET.txt` preserves Princeton's licence. WordNet data source:
https://github.com/nltk/nltk_data/blob/gh-pages/packages/corpora/wordnet.zip

Build: `python scripts/build-word-workshop-lexicon.py` (system hunspell-en-us and
libhunspell required), then `python scripts/enrich-word-workshop-wordnet.py /path/to/wordnet.zip`. The resulting lexicon has 112,818 spellings. The browser loads the compressed local asset only when
Word Craft is opened, with an uncompressed JSON fallback. No external API, API
key, package download, or network dictionary service is used during play.

Spelling attestation does not establish an exhaustive semantic word family or
CEFR level. Authored joins cover special transformations; dictionary-authorized
and transparent productive joins broaden the workbench. Every selected word is
retained and has unrestricted context writing, including words and phrases for
which no form drill is generated.
