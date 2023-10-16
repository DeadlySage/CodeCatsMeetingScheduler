import React, { useState } from "react";

import Calendar from "../Calendar";
import { Container } from "reactstrap";

const SpongeBob_Squarepants = () => {
    return(
        <Container maxWidth = "lg">
            <div>
                <h1>
                    Spongebob Squarepant's Calendar
                </h1>
                <Calendar />
            </div>
        </Container>
    );
};

export default SpongeBob_Squarepants;

