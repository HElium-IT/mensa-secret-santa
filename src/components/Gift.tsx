import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Badge, Card, Flex } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function Gift({ gift, ownerGamePerson, onDelete, selected = false }: {
    readonly gift: Schema["Gift"]["type"],
    readonly ownerGamePerson?: Schema["GamePerson"]["type"],
    readonly onDelete?: () => void,
    readonly selected?: boolean
}) {
    const [giftWinner, setGiftWinner] = useState<Schema["GamePerson"]["type"]["personId"]>();
    const [giftWanters, setGiftWanters] = useState<Schema["GamePerson"]["type"][]>();
    const [promptDeleteConfirmation, setPromptDeleteConfirmation] = useState(false);
    const [personWantsGift, setPersonWantsGift] = useState(ownerGamePerson?.wantsGiftPersonId === gift.ownerPersonId);
    const [gamePersonHasGift, setGamePersonHasGift] = useState(false);

    useEffect(() => {
        if (!gift) return;

        async function fetchGiftWinner() {
            if (!gift.winnerPersonId) return;
            const { data: person, errors } = await client.models.Person.get({
                ownerId: gift.winnerPersonId
            })
            if (errors) {
                console.error("Gift.fetchGiftWinner", errors);
                return;
            }
            if (!person) return;
            setGiftWinner(person.ownerId);
        }

        if (gift.winnerPersonId) {
            fetchGiftWinner();
            return;
        }

        const wantersSubscription = client.models.GamePerson.observeQuery({
            filter: {
                gameId: { eq: gift.ownerGameId },
            }
        }).subscribe({
            next: ({ items: gamePeople }) => {
                console.log("Gift.wantersSubscription", gamePeople);
                setGiftWanters(gamePeople.filter(({ wantsGiftPersonId }) => wantsGiftPersonId === gift.ownerPersonId));
            }
        });

        return () => wantersSubscription.unsubscribe();

    }, [gift]);


    useEffect(() => {
        ownerGamePerson?.wonGift().then(({ data: wonGift }) => {
            setGamePersonHasGift(!!wonGift);

        });
    }, [ownerGamePerson]);

    async function deleteGift() {
        if (!gift) return;
        const { data: resultGift, errors } = await client.models.Gift.delete({
            ownerGameId: gift.ownerGameId,
            ownerPersonId: gift.ownerPersonId
        });
        if (errors) {
            console.error("Gift.deleteGift", errors);
            return;
        }
        console.debug("Gift.deleteGift", resultGift);
        if (onDelete)
            onDelete();

    }

    async function setGiftAsWanted(value: boolean = true) {
        if (!gift || !ownerGamePerson) return;
        const { data: gamePerson, errors } = await client.models.GamePerson.update({
            personId: ownerGamePerson.personId,
            gameId: ownerGamePerson.gameId,
            wantsGiftPersonId: (value && gift.ownerPersonId) || null
        })
        if (errors) {
            console.error("Gift.setGiftAsWanted", errors);
            return;
        }
        console.debug("Gift.setGiftAsWanted", gamePerson);
        setPersonWantsGift(value);
    }


    if (gift.isSelected && selected && gift.ownerPersonId === ownerGamePerson?.personId)
        return null;

    return (
        <Card
            // variation="outlined"
            padding={10}
            backgroundColor="rgba(255, 255, 255, 0)"
            style={{
                border: "2px solid",
                borderRadius: "8px",
                boxShadow: gift.isSelected && gift.ownerPersonId !== ownerGamePerson?.personId
                    ? 'inset 0 0 10px rgb(100, 100, 100)'
                    : gift.winnerPersonId === ownerGamePerson?.personId
                        ? 'inset 0 0 10px #FFD700'
                        : 'none'
            }}
        >
            <Flex direction="column" alignItems="flex-start" >
                <Flex direction="row" alignItems="space-between" justifyContent={"center"} wrap="wrap" >
                    <h2 style={{ margin: '0px' }}>
                        {gift.number ?? ""}
                        {gift.number && (!gift.isSelected || gift.ownerPersonId === ownerGamePerson?.personId) && gift.winnerPersonId !== ownerGamePerson?.personId ? '-' : ''}
                        {gift.winnerPersonId === ownerGamePerson?.personId ? '🎁' : ''}
                        {gift.ownerPersonId !== ownerGamePerson?.personId ? (gift.winnerPersonId ? gift.ownerPersonId.split("@")[0] : "") : gift.name}
                    </h2>
                    {!promptDeleteConfirmation && ownerGamePerson?.personId === gift.ownerPersonId && (gift.number ?? 0) === 0 &&
                        <button style={{ background: 'red', padding: "5px" }} onClick={() => setPromptDeleteConfirmation(true)}>Elimina</button>
                    }
                    {promptDeleteConfirmation && ownerGamePerson?.personId === gift.ownerPersonId && (gift.number ?? 0) === 0 &&
                        <>
                            <button style={{ background: 'red', padding: "5px" }} onClick={deleteGift}>Si</button >
                            <button style={{ padding: "5px" }} onClick={() => {
                                setPromptDeleteConfirmation(false);
                            }}>No</button>
                        </>
                    }
                    {gift.isSelected && !gift.winnerPersonId && gift.ownerPersonId !== ownerGamePerson?.personId && !gamePersonHasGift ?
                        !personWantsGift ? <button style={{ padding: "5px", background: "green" }} onClick={() => setGiftAsWanted()}>Lo voglio!</button>
                            :
                            <button style={{ background: 'red', padding: "5px" }}
                                onClick={() => setGiftAsWanted(false)}>Non lo voglio</button>
                        : <></>
                    }
                </Flex>
                <Flex direction="row" alignItems="flex-start" wrap="wrap" gap="0.2rem" >
                    <Badge size="large" variation="success">{gift.attribute_1} </Badge>
                    <Badge size="large" variation="success">{gift.attribute_2}</Badge>
                    <Badge size="large" variation="success">{gift.attribute_3}</Badge>
                </Flex>
                {gift.winnerPersonId !== ownerGamePerson?.personId
                    && <>
                        {!giftWinner && gift.isSelected && gift.ownerPersonId === ownerGamePerson?.personId &&
                            <h4 className="gift-winner">Il tuo regalo è stato pescato!</h4>
                        }
                        {!giftWinner && gift.isSelected && giftWanters && (giftWanters.length > 0) &&
                            <h4>Voluto da {giftWanters.length} person{giftWanters.length === 1 ? 'a' : 'e'}
                            </h4>
                        }

                        {giftWinner && <h4 className="gift-winner">Il tuo regalo è stato vinto da {giftWinner}</h4>}
                    </>
                }
                {
                    gift.winnerPersonId === ownerGamePerson?.personId &&
                    <h4>Ricordati di ritirare il regalo!</h4>
                }
            </Flex>
        </Card>
    );
}

export default Gift;
