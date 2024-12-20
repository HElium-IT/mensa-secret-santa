
function AbandonPrompt({ promptAbandonConfirmation, setPromptAbandonConfirmation, abandonGame, role }: {
    readonly promptAbandonConfirmation: boolean;
    readonly setPromptAbandonConfirmation: (value: boolean) => void;
    readonly abandonGame: () => void;
    readonly role: string;
}) {
    return (
        <>
            {!promptAbandonConfirmation && role !== "CREATOR" && (
                <button style={{ background: 'red' }} onClick={() => setPromptAbandonConfirmation(true)}>
                    Abbandona
                </button>
            )}
            {promptAbandonConfirmation && (
                <>
                    <button style={{ background: 'red' }} onClick={abandonGame}>
                        Conferma
                    </button>
                    <button style={{ background: 'lightcoral' }} onClick={() => setPromptAbandonConfirmation(false)}>
                        Annulla
                    </button>
                </>
            )}
        </>
    );
}

export default AbandonPrompt;