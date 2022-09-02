import { render, screen } from "@testing-library/react"
import { ActiveLink } from ".";

jest.mock("next/router", () => {
    return {
        useRouter() {
            return {
                asPath: "/"
            }
        }
    }
});

const { getByText } = screen;

describe('ActiveLink component', () => {
    it("should render correctly", () => {
        render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        );

        expect(getByText("Home")).toBeInTheDocument();
    });

    it("should have active class when the link is currently active", () => {
        render(
            <ActiveLink href="/" activeClassName="active">
                <a >Home</a>
            </ActiveLink>
        );

        expect(getByText("Home")).toHaveClass("active");
    });
});

