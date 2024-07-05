'''
AIM : Implement following Word embedding techniques in NLP.
a. TFIDF- Term Frequency Inverse document Frequency
b. BOW (Bag of Words)
c. Word2Vec 

'''

'''
1. TF-IDF (Term Frequency-Inverse Document Frequency):
TF-IDF is a numerical representation that reflects the importance of a word in a document relative to a collection of documents (corpus). It combines the term frequency (TF) and inverse document frequency (IDF) to assign a weight to each word in the document.

'''
from sklearn.feature_extraction.text import TfidfVectorizer

# Sample corpus of sentences
corpus = [
    "This is the first document.",
    "This document is the second document.",
    "And this is the third one.",
    "Is this the first document?",
]

# Create the TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer()

# Fit and transform the corpus to obtain the TF-IDF matrix
tfidf_matrix = tfidf_vectorizer.fit_transform(corpus)

# Print the feature names (words)
print("Feature names (words):", tfidf_vectorizer.get_feature_names_out())

# Print the TF-IDF matrix
print("TF-IDF matrix:")
print(tfidf_matrix.toarray())
'''

2. Bag of Words (BOW):
BOW represents text data as a collection of words without considering grammar or word order. It creates a vocabulary of unique words and counts the frequency of each word in a document.

'''
from sklearn.feature_extraction.text import CountVectorizer

# Sample corpus of sentences
corpus = [
    "This is the first document.",
    "This document is the second document.",
    "And this is the third one.",
    "Is this the first document?",
]

# Create the BOW vectorizer
bow_vectorizer = CountVectorizer()

# Fit and transform the corpus to obtain the BOW matrix
bow_matrix = bow_vectorizer.fit_transform(corpus)

# Print the feature names (words)
print("Feature names (words):", bow_vectorizer.get_feature_names_out())

# Print the BOW matrix
print("BOW matrix:")
print(bow_matrix.toarray())
'''

3. Word2Vec:
Word2Vec is a neural network-based word embedding technique that represents words as dense vectors in a continuous vector space. It captures semantic relationships between words, making it suitable for various NLP tasks.

Since Word2Vec is usually trained on large amounts of text data to learn meaningful representations, we'll use the pre-trained Word2Vec model from the `gensim` library for demonstration purposes.

'''
import gensim.downloader as api

# Load the pre-trained Word2Vec model
word2vec_model = api.load("word2vec-google-news-300")

# Sample words
word_list = ["apple", "banana", "car", "dog", "king"]

# Get word embeddings for the sample words
for word in word_list:
    try:
        word_embedding = word2vec_model[word]
        print(f"Word: {word}, Embedding: {word_embedding}")
    except KeyError:
        print(f"Word: {word} not found in the pre-trained Word2Vec model.")
