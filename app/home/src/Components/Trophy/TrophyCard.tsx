import React from "react";
import { Link } from "react-router-dom";

export default function TrophyCard(props: any) {
    return (
        <React.Fragment>
            {/* {JSON.stringify(props)} */}
            <Link
                to={`/trophy?id=${props?.trophy_data.unique_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <h2>{props.trophy_data.name}</h2>
                <p>{props.trophy_data.description}</p>
                <img
                    src={props.trophy_data._links.thumbnail}
                    alt={props.trophy_data.name}
                    style={{
                        width: 'auto',
                        display: props?.trophy_data?.display || 'block'
                    }}
                />
            </Link>
        </React.Fragment>
    );
}