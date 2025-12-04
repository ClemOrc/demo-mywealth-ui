import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

/**
 * Custom navigation hook that properly handles basePath
 * Fixes the bug where navigate() ignores basePath in embedded mode
 * 
 * Usage:
 *   const nav = useAppNavigation(basePath);
 *   nav.goToDashboard();
 *   nav.goToAgreementDetails('123');
 */
export const useAppNavigation = (basePath: string = '') => {
  const navigate = useNavigate();

  const buildPath = (path: string) => `${basePath}${path}`;

  return {
    goToDashboard: () => navigate(buildPath(ROUTES.DASHBOARD)),
    
    goToCreateAgreement: () => navigate(buildPath(ROUTES.CREATE_AGREEMENT)),
    
    goToAgreementDetails: (id: string) => 
      navigate(buildPath(ROUTES.AGREEMENT_DETAILS(id))),
    
    goToModifyAgreement: (id: string) => 
      navigate(buildPath(ROUTES.MODIFY_AGREEMENT(id))),
    
    goToPendingModifications: () => 
      navigate(buildPath(ROUTES.PENDING_MODIFICATIONS)),
    
    goBack: () => navigate(-1),
    
    // Generic navigation with basePath support
    navigateTo: (path: string) => navigate(buildPath(path)),
  };
};
