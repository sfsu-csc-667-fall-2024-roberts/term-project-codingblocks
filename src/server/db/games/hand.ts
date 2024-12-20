// adapted from https://github.com/claudijo/poker-ts/
// note: the straight, flush all that seem to complexc for me to integrate
// so skipping

enum HandRanking {
    HIGH_CARD = 0,
    PAIR = 1,
    TWO_PAIR = 2,
    THREE_OF_A_KIND = 3,
    FOUR_OF_A_KIND = 4,
}

type Card = {
    face_value: number;
    value: string;
    suit: string;
};

export function evaluateHand(playerCards: Card[], communityCards: Card[]) {
    const allCards = [...playerCards, ...communityCards];

    const rankOccurrences: number[] = new Array(15).fill(0);
    for (const card of allCards) {
        rankOccurrences[card.face_value] += 1;
    }

    const sortedCards = [...allCards].sort((c1, c2) => {
        if (rankOccurrences[c1.face_value] === rankOccurrences[c2.face_value]) {
            return c2.face_value - c1.face_value;
        }
        return rankOccurrences[c2.face_value] - rankOccurrences[c1.face_value];
    });

    const highestCount = Math.max(...rankOccurrences);
    const highestCountValue = sortedCards[0].face_value;

    let ranking: HandRanking;
    let strength: number;

    if (highestCount === 4) {
        ranking = HandRanking.FOUR_OF_A_KIND;
        strength = highestCountValue;
    } else if (highestCount === 3) {
        ranking = HandRanking.THREE_OF_A_KIND;
        strength = highestCountValue;
    } else if (highestCount === 2) {
        const secondPairIndex = sortedCards.findIndex(
            (card) =>
                card.face_value !== highestCountValue &&
                rankOccurrences[card.face_value] === 2,
        );

        if (secondPairIndex !== -1) {
            ranking = HandRanking.TWO_PAIR;
            strength =
                highestCountValue * 100 +
                sortedCards[secondPairIndex].face_value;
        } else {
            ranking = HandRanking.PAIR;
            strength = highestCountValue;
        }
    } else {
        ranking = HandRanking.HIGH_CARD;
        strength = Math.max(...allCards.map((c) => c.face_value));
    }

    return {
        rank: ranking,
        highCard: strength,
    };
}

export function compareHands(
    hand1: ReturnType<typeof evaluateHand>,
    hand2: ReturnType<typeof evaluateHand>,
): number {
    if (hand1.rank !== hand2.rank) {
        return hand1.rank - hand2.rank;
    }
    return hand1.highCard - hand2.highCard;
}
