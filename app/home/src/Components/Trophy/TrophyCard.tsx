import React from "react";

export default function TrophyCard(props: any) {
    return (<React.Fragment>
        <div>
            <h2>{props.trophy_data.name}</h2>
            <p>{props.trophy_data.description}</p>
            <img
                src={props.trophy_data.asset}
                alt={props.trophy_data.name}
                style={{ width: '100%' }}
            />
        </div>
    </React.Fragment>);
}