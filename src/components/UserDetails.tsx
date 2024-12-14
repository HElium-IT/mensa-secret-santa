function UserDetails({ user, signOut }: {
    readonly user: any,
    readonly signOut: () => Promise<void>
}) {
    return (
        <div className="flex-row" style={{ justifyContent: "center" }}>
            <h2 style={{ textAlign: "center", textOverflow: "ellipsis", overflow: "hidden" }}>
                {user?.signInDetails?.loginId?.split('@')[0]}
            </h2>
            <button type="button" onClick={signOut}>
                LogOut
            </button>
        </div>
    )
}

export default UserDetails;