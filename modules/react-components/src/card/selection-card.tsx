/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Card, CardProps } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Proptypes for the selection card component.
 */
export interface SelectionCardPropsInterface extends TestableComponentInterface {
    /**
     * Additional classes.
     */
    className?: string;
    /**
     * Card description.
     */
    description?: string;
    /**
     * Is card disabled.
     */
    disabled?: boolean;
    /**
     * Card header.
     */
    header: string;
    /**
     * Id for the card.
     */
    id?: string;
    /**
     * Image for the card.
     */
    image?: any;
    /**
     * Side of the image.
     */
    imageSize?: GenericIconSizes;
    /**
     * On click callback.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - On click event.
     * @param {CardProps} data - Card data.
     */
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: CardProps) => void;
    /**
     * If the card is selected.
     */
    selected?: boolean;
    /**
     * Card size.
     */
    size?: "small" | "default" | "auto";
    /**
     * Add spacing to the card.
     */
    spaced?: "bottom";
    /**
     * Text alignment.
     */
    textAlign?: "center" | "left" | "right";
    /**
     * If the card should be inline.
     */
    inline?: boolean;
}

/**
 * Selection card component.
 *
 * @param {SelectionCardPropsInterface} props - Props injected to the components.
 *
 * @return {React.ReactElement}
 */
export const SelectionCard: FunctionComponent<SelectionCardPropsInterface> = (
    props: SelectionCardPropsInterface
): ReactElement => {

    const {
        className,
        description,
        disabled,
        header,
        id,
        inline,
        image,
        imageSize,
        onClick,
        selected,
        size,
        spaced,
        textAlign,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "selection-card",
        {
            disabled,
            inline,
            selected,
            [ size ]: size,
            [`spaced-${ spaced }`]: spaced,
            ["with-image"]: image
        },
        className
    );

    return (
        <Card
            id={ id }
            className={ classes }
            onClick={ onClick }
            link={ false }
            as="div"
            data-testid={ testId }
        >
            {
                image && (
                    <Card.Content className="card-image-container">
                        <GenericIcon
                            className="card-image"
                            size={ imageSize }
                            icon={ image }
                            data-testid={ `${ testId }-image` }
                            square
                            transparent
                        />
                    </Card.Content>
                )
            }
            <Card.Content className="card-text-container" style={ { textAlign } }>
                <Card.Header data-testid={ `${ testId }-header` }>{ header }</Card.Header>
                { description && (
                    <Card.Description data-testid={ `${ testId }-description` }>
                        { description }
                    </Card.Description>
                ) }
            </Card.Content>
        </Card>
    );
};

/**
 * Default props for the selection card component.
 */
SelectionCard.defaultProps = {
    "data-testid": "selection-card",
    imageSize: "tiny",
    inline: false,
    onClick: () => null,
    size: "default",
    textAlign: "center"
};
