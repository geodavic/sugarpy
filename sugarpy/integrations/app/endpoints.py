from sugarpy import MorphologyCounter

def html_mlu_response(input_str: str):
    total_words = 0
    total_morphemes = 0
    total_utterances = 0
    lines = []
    c = MorphologyCounter()
    for utterance in input_str.split("\n"):
        if utterance.strip():
            line, num_morph, num_words = c.count(utterance.strip())
            total_morphemes += num_morph
            total_words += num_words
            lines += [line]
            total_utterances += 1

    mlu = round(total_morphemes/total_utterances,2)
    # todo: make this a template
    resp = f"""<center><b><p style="font-size:20px">Total utterances: {total_utterances}, morphemes: {total_morphemes}, MLU: {mlu}</p></b></center><br>"""
    resp += "<p>" + "<br>".join(lines) + "</p>"
        
    return resp
