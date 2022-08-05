import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps {
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...props }: ActiveLinkProps) {
    //Link deve estar por volta de uma anchor tag, assim não perde-se o comportamento de SPA
    //cloneElement é uma função extremamente útil no react.
    //Permite com que quando passo um elemento children via propriedade
    //eu possa clona-lo e passar propriedades para ele
    const { asPath } = useRouter();

    const className = asPath === props.href ? activeClassName : '';

    return (
        <Link {...props}>
            {cloneElement(children, { className: className })}
        </Link>
    )
}