import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormationsPage from '../FormationsPage';
import { BrowserRouter } from 'react-router-dom';
import { formationsData } from '../../../data/formationsData';
import { useSubscription } from '../../../hooks/useSubscription';

describe('Page Formations', () => {
  it('affiche tous les domaines de formation', () => {
    render(
      <BrowserRouter>
        <FormationsPage />
      </BrowserRouter>
    );
    formationsData.forEach(f => {
      expect(screen.getByText(f.title)).toBeInTheDocument();
      expect(screen.getByText(f.description)).toBeInTheDocument();
    });
  });

  it('redirige vers la bonne URL pour un abonné', () => {
    jest.spyOn(require('../../../hooks/useSubscription'), 'useSubscription').mockReturnValue({ hasActiveSubscription: true });
    window.open = jest.fn();
    render(
      <BrowserRouter>
        <FormationsPage />
      </BrowserRouter>
    );
    const btn = screen.getAllByRole('button', { name: /accéder/i })[0];
    fireEvent.click(btn);
    expect(window.open).toHaveBeenCalledWith(formationsData[0].url, '_blank');
  });

  it('redirige vers /subscription pour un non abonné', () => {
    jest.spyOn(require('../../../hooks/useSubscription'), 'useSubscription').mockReturnValue({ hasActiveSubscription: false });
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    render(
      <BrowserRouter>
        <FormationsPage />
      </BrowserRouter>
    );
    const btn = screen.getAllByRole('button', { name: /accéder/i })[0];
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith('/subscription');
  });
}); 