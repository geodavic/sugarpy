def sim_iou(tup, word_sublist):
    """Intersection over union similarity between a tuple and a word sublist."""
    s1 = set(tup)
    s2 = set(word_sublist)
    intersection = len(s1 & s2)
    union = len(s1 | s2)
    return intersection / union if union > 0 else 0.0


def optimal_partition(words, tuples, sim=sim_iou):
    """
    Find the optimal partition of words into len(tuples) contiguous segments,
    where segment k is matched to tuples[k], maximizing total similarity.

    Args:
        words: list of words (length N)
        tuples: list of tuples of words (length L), ordered left-to-right
        sim: function(tuple, words_sublist) -> float (default: IoU)

    Returns:
        best_score: float
        segments: list of L (start, end) index pairs (inclusive)
    """
    N = len(words)
    L = len(tuples)

    NEG_INF = float("-inf")
    dp = [[NEG_INF] * (L + 1) for _ in range(N + 1)]
    back = [[0] * (L + 1) for _ in range(N + 1)]

    dp[0][0] = 0.0

    for k in range(1, L + 1):
        for j in range(k, N - (L - k) + 1):
            for i in range(k - 1, j):
                score = dp[i][k - 1] + sim(tuples[k - 1], words[i:j])
                if score > dp[j][k]:
                    dp[j][k] = score
                    back[j][k] = i

    segments = []
    j = N
    for k in range(L, 0, -1):
        i = back[j][k]
        segments.append((i, j - 1))
        j = i
    segments.reverse()

    return dp[N][L], segments
