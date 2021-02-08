import React from 'react';
import { render, fireEvent, waitFor} from '@testing-library/react';
import SignUp from '../../pages/SignUp';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
})

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  }
})

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  }
})


describe('SignUp Page' ,() => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  })

  /*it('should be able to sign up ',async () => {

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, {target: {value: 'John Doe'}})
    fireEvent.change(emailField, {target: {value: 'johndoe@example.com'}})
    fireEvent.change(passwordField, {target: {value: '987456'}})

    fireEvent.click(buttonElement);

    await waitFor(() => {
     expect(mockedHistoryPush).toHaveBeenCalledWith('/');
     expect(mockedAddToast).toHaveBeenCalledWith(expect.objectContaining({
       type: 'success',
     }))
    })
  });*/

  it('should not be able to sign up  with invalid credentials',async () => {

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');


    fireEvent.change(nameField, {target: {value: 'John Doe'}})
    fireEvent.change(emailField, {target: {value: 'not-valid-email'}})
    fireEvent.change(passwordField, {target: {value: '123456'}})

    fireEvent.click(buttonElement);

    await waitFor(() => {
     expect(mockedHistoryPush).not.toHaveBeenCalled();
    })
  });
  it('should display an error if create account fails',async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    })

    const { getByPlaceholderText, getByText } = render(<SignUp />);


    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');


    fireEvent.change(nameField, {target: {value: 'John Doe'}})
    fireEvent.change(emailField, {target: {value: 'johndoe@example.com'}})
    fireEvent.change(passwordField, {target: {value: '123456'}})
    fireEvent.click(buttonElement);

    await waitFor(() => {
     expect(mockedAddToast).toHaveBeenCalledWith(expect.objectContaining({
        type: 'error',
       }),
     );
    })
  });
});
