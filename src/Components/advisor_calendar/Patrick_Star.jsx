import React, { useState } from "react";

import Calendar from "../Calendar";
import { Container } from "reactstrap";

const Patrick_Star = () => {
    return(
        <Container maxWidth = "lg">
            <div>
                <h1>
                    Patrick Star's Calendar
                </h1>
                <Calendar />
            </div>
        </Container>
    );
};

export default Patrick_Star;

