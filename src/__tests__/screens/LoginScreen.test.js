import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../screens/LoginScreen';
// besoin d'importer authSlice pour espionner les fonctions loginUser et clearError
import * as authSlice from '../../redux/slices/authSlice';

// mock react-redux
const mockDispatch = jest.fn();

// lorsque LoginScreen demandera useDispatch, on effectuera mockDispatch
// lorsque LoginScreen demandera useSelector, lui donnera des valeurs pour l'état initial
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector({
    auth: { isLoading: false, error: null } // etat initial 
  }),
}));

// mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// mock des actions redux 
// = éviter les appels réseau réels
jest.mock('../../redux/slices/authSlice', () => ({
  loginUser: jest.fn(),
  clearError: jest.fn(),
}));

// regroupement des tests
describe('LoginScreen', () => {

  // reset des mocks avant chaque nouveau test
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockReturnValue(Promise.resolve({ type: 'osef' }));
  });

  // vérification du rendu "visuel"
  it('affichage correct des éléments', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    // vérifie la présence des éléments clés : champs de saisie + boutton de connexion
    expect(getByPlaceholderText('boss@flemme.com')).toBeTruthy();
    expect(getByPlaceholderText('unvraimotdepasse')).toBeTruthy();
    expect(getByText('SE CONNECTER')).toBeTruthy();
  });

  it('erreur champs vides', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    
    // cas clic bouton connexion avec champs vides
    fireEvent.press(getByText('SE CONNECTER'));
    expect(getByText("Nan, t'as vraiment pas le droit d'avoir autant la flemme.")).toBeTruthy();
    // dispatch ne doit pas être appelé
    expect(authSlice.loginUser).not.toHaveBeenCalled();
  });

  it('erreur format invalide du champs de saisie mail', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    // cas mauvais email
    fireEvent.changeText(getByPlaceholderText('boss@flemme.com'), 'mauvais-email');
    fireEvent.changeText(getByPlaceholderText('unvraimotdepasse'), 'password123');
    fireEvent.press(getByText('SE CONNECTER'));

    expect(getByText("On a pas les yeux en face des trous?")).toBeTruthy();
  });

  it('test de connexion réussie', async () => {
    // = simuler un succès
    // = mocker le comportement de .match() 
    const successAction = { type: 'auth/login/fulfilled', payload: { user: 'test' } };
    
    // si loginUser possède la propriété 'fulfilled'
    authSlice.loginUser.fulfilled = { match: () => true };
    // retourne la promise de l'action réussie
    mockDispatch.mockResolvedValue(successAction);

    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    // remplissage correct
    fireEvent.changeText(getByPlaceholderText('boss@flemme.com'), 'test@valid.com');
    fireEvent.changeText(getByPlaceholderText('unvraimotdepasse'), 'secret');
    fireEvent.press(getByText('SE CONNECTER'));

    await waitFor(() => {

      expect(mockDispatch).toHaveBeenCalledWith(undefined); // clearError() retourne undefined car mocké basiquement
      // appel de login avec les bons paramètres
      expect(authSlice.loginUser).toHaveBeenCalledWith({
        email: 'test@valid.com',
        password: 'secret'
      });
      
      //navigation déclenchée = dispatch retourne un succès
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Main');
    });
  });
});