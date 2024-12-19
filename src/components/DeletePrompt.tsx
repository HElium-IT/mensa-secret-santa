
function DeletePrompt({ promptDeleteConfirmation, setPromptDeleteConfirmation, deleteGame, role, isAdmin }: {
    readonly promptDeleteConfirmation: boolean;
    readonly setPromptDeleteConfirmation: (value: boolean) => void;
    readonly deleteGame: () => void;
    readonly role: string;
    readonly isAdmin: boolean;
}) {
    return (
        <>
            {!promptDeleteConfirmation && (role === "CREATOR" || isAdmin) && (
                <button style={{ background: 'red' }} onClick={() => setPromptDeleteConfirmation(true)}>
                    Elimina
                </button>
            )}
            {promptDeleteConfirmation && (
                <>
                    <button style={{ background: 'red' }} onClick={deleteGame}>
                        Conferma
                    </button>
                    <button style={{ background: 'lightcoral' }} onClick={() => setPromptDeleteConfirmation(false)}>
                        Annulla
                    </button>
                </>
            )}
        </>
    );
}

export default DeletePrompt;