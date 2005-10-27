"""
# C Version
char *search( k, pat, text )
int k;
char *pat, *text;
{
    int j, m, count;
    m = strlen(pat);
    if( m <= k )
        return( text );
    for( ; *text != EOS; text++ ) {
        for( count=j=0; j < m && count <= k; j++ )
            if( pat[j] != text[j] )
                count++;
        if( count <= k ) 
            return( text );
    }
    return( NULL );
}

char *search( maxMisses, guess, answer )
int maxMisses;
char *guess, *answer;
{
    int i, ln, misses;
    ln = strlen(guess);
    if( ln <= maxMisses )
        return( answer );
    for( ; *answer != EOS; answer++ ) {
        for( misses=i=0; i < ln && misses <= maxMisses; i++ )
            if( guess[i] != answer[i] )
                misses++;
        if( misses <= maxMisses ) 
            return( answer );
    }
    return( NULL );
}
"""

# Python Version
def match(maxMisses, guess, answer, verbose=False):
    if len(guess) <= maxMisses:
        return answer
    iterations = 0
    for string1, string2 in [(answer, guess), (guess, answer)]:
        while string1:
            iterations += 1
            misses = abs(len(string1) - len(string2))
            if verbose:
                print 'checking:', string1
            for a, b in zip(string2, string1):
                if a != b:
                    misses += 1
                if misses > maxMisses:
                    break
            if misses <= maxMisses:
                return iterations, misses
            string1 = string1[1:]
    return None

strings = [
    ('dog', 'dog'),
    ('dog', 'log'),
    ('dog', 'god'),
    ('gogi', 'dog'),
    ('dog', 'gogi'),
    ('mispeld', 'misspelled'),
    ('misspeld', 'misspelled'),
    ('jerman', 'german'),
    ('geramy', 'jeremy'),
    ('jaramy', 'jeremy'),
    ('jeeremy', 'jeremy'),
    ('mi huse iz big', 'my house is big'),
    ('my house is small', 'my house is big'),
    ('mi house is small', 'my house is big'),
    ('phisiotherapist', 'physiotherapist'),
    ('fisiotherapist', 'physiotherapist'),
    ('fisioterapist', 'physiotherapist'),
    ('phisioterapist', 'physiotherapist'),
    ('fisioterapis', 'physiotherapist'),
    ('therapist', 'physiotherapist'),
    ('fizzytherapist', 'physiotherapist'),
    ('psycotherapist', 'physiotherapist'),
    ('sextherapist', 'physiotherapist'),
    ('geological', 'geological'),
    ('giological', 'geological'),
    ('giologikal', 'geological'),
    ('giolofikal', 'geological'),
    ('giologikal', 'geological'),
    ('giological', 'geological'),
    ('giologicaf', 'geological'),
    ('giologicof', 'geological'),
    ('gi1logicof', 'geological'),
    ('xxxxxxxxx', 'geological'),
    ('geologlog', 'geological'),
    ]

for guess, answer in strings:
    print guess, answer, len(answer)/4,
    print match(len(answer)/4, guess, answer) or 'FAIL'
