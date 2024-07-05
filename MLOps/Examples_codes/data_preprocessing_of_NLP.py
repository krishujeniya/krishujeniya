# AIM : Perform following data preprocessing on text/paragraph using NLTK library:
# a. Write a Python program to tokenize words, sentence wise.
# b. Write a python program that accepts the list of tokenized word and stems it into root word.
# c. Write a program in python to identify the part of speech for each word in the text.
# d. Write a Python NLTK program to remove stop words from a given text.
# e. Write a python program for identifying and correcting misspelled words in a given text, such as an essay or a letter. 

'''
1. Tokenize words and sentences:
Tokenization is the process of breaking text into words or sentences. We'll use the NLTK library to achieve this.

'''
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize

# Sample text
text = "NLTK is a powerful library for natural language processing. It provides various tools for text analysis."
# Tokenize sentences
sentences = sent_tokenize(text)
print("Tokenized Sentences:", sentences)
# Tokenize words
words = word_tokenize(sentences)
print("Tokenized Words:", words)


'''

2. Stemming words into root words:
Stemming is the process of reducing words to their root or base form. The most common stemming algorithm is the Porter stemming algorithm.

'''
from nltk.stem import PorterStemmer

# Sample tokenized words (from the previous step)
tokenized_words = ['NLTK', 'is', 'a', 'powerful', 'library', 'for', 'natural', 'language', 'processing', '.', 'It', 'provides', 'various', 'tools', 'for', 'text', 'analysis', '.']

# Initialize the Porter Stemmer
stemmer = PorterStemmer()

# Stem the words
stemmed_words = [stemmer.stem(word) for word in tokenized_words]
print("Stemmed Words:", stemmed_words)
'''

3. Identify the part of speech for each word:
Part-of-speech tagging is the process of assigning a grammatical label (part-of-speech) to each word in a sentence.

'''
from nltk import pos_tag

# Sample tokenized words (from the previous step)
tokenized_words = ['NLTK', 'is', 'a', 'powerful', 'library', 'for', 'natural', 'language', 'processing', '.', 'It', 'provides', 'various', 'tools', 'for', 'text', 'analysis', '.']

# Perform Part-of-Speech tagging
pos_tags = pos_tag(tokenized_words)
print("Part-of-Speech Tags:", pos_tags)
'''

4. Remove stop words from the given text:
Stop words are common words that do not carry significant meaning and are often removed to reduce noise in text data.

'''
from nltk.corpus import stopwords

# Sample tokenized words (from the previous step)
tokenized_words = ['NLTK', 'is', 'a', 'powerful', 'library', 'for', 'natural', 'language', 'processing', '.', 'It', 'provides', 'various', 'tools', 'for', 'text', 'analysis', '.']

# Get a set of stop words from NLTK
stop_words = set(stopwords.words("english"))

# Remove stop words from the tokenized words
filtered_words = [word for word in tokenized_words if word.lower() not in stop_words]
print("Filtered Words (Without Stopwords):", filtered_words)
'''

5. Identify and correct misspelled words:
To identify and correct misspelled words, you'll need a language model or dictionary. One common approach is using the `WordNetLemmatizer` in NLTK.

'''
from nltk.stem import WordNetLemmatizer

# Sample tokenized words (from the previous step)
tokenized_words = ['NLTK', 'is', 'a', 'powerful', 'library', 'for', 'natural', 'language', 'processing', '.', 'It', 'provides', 'various', 'tools', 'for', 'text', 'analysis', '.']

# Initialize the WordNet Lemmatizer
lemmatizer = WordNetLemmatizer()

# Lemmatize the words
lemmatized_words = [lemmatizer.lemmatize(word) for word in tokenized_words]
print("Lemmatized Words:", lemmatized_words)
