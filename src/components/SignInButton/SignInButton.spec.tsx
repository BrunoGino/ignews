import { render, screen } from "@testing-library/react"
import { Session } from "inspector";
import {useSession} from "next-auth/react"
import { SignInButton } from ".";

jest.mock("next-auth/react", () => {
    return {
        useSession: jest.fn()
    }
});

describe('SignInButton component', () => {
    it('should render correctly when user is not authenticated', () => {
        (useSession as jest.Mock).mockImplementationOnce(() => [null, false]);
        const { debug } = render(
            <SignInButton />
        );
        debug()
        expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
    });


    it('renders correctly when user is authenticated', () => {
        (useSession as jest.Mock).mockReturnValueOnce({data: {user : {name: 'John Doe', email: 'john.doe@example.com'}, expires: 'fake-expires'}, status:'authenticated'});
        render(<SignInButton />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
    })
})