import React, { useState } from "react";

import Calendar from "../Calendar";
import { Container } from "reactstrap";

const Yu_Chen = () => {
    return(
        <Container maxWidth = "lg">
            <div>
                <h1>
                    Yu Chen's Calendar
                </h1>
                <Calendar />
            </div>
        </Container>
    );
};

export default Yu_Chen;

