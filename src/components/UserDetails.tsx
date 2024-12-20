import { Flex } from "@aws-amplify/ui-react";

function UserDetails({ user }: {
    readonly user: any,
}) {
    return (
        <Flex direction="row" justifyContent="center" alignItems="center">
            <h2 style={{ margin: "0px", textAlign: "center", textOverflow: "ellipsis", overflow: "hidden" }}>
                {user?.signInDetails?.loginId?.split('@')[0]}
            </h2>
        </Flex>
    )
}

export default UserDetails;