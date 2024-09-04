// CREADO: MARIA
// FECHA DE CREACION: 15/08
// FECHA DE MODIFICACION: 
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    resources: {
      en: {
        translation: {
          "login": "Login",
          "register": "Register",
          "username": "Username",
          "password": "Password",
          "email": "Email",
          "invalid_email": "Please enter a valid email address.",
          "invalid_password": "Password must be at least 8 characters long, including an uppercase letter, a number, and a special character.",
          "login_error": "There was an error logging in. Please try again.",
          "registration_error": "There was an error registering. Please try again.",
          "no_account": "Don't have an account?",
          "register_here": "Register here",
          "already_have_account": "Already have an account?",
          "login_here": "Login here",
          "registration_success": "Registration successful! Redirecting to login...",
          "app_name": "My Application",
          "Send recovery link": "Send recovery link",
          "Recover Password": "Recover Password",
          "Forgot your password?": "Forgot your password?"
        }
      },
      es: {
        translation: {
          "login": "Iniciar sesión",
          "register": "Registrarse",
          "username": "Usuario",
          "password": "Contraseña",
          "email": "Correo electrónico",
          "invalid_email": "Por favor, ingresa un correo electrónico válido.",
          "invalid_password": "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, un número y un carácter especial.",
          "login_error": "Hubo un error al iniciar sesión. Por favor, intenta nuevamente.",
          "registration_error": "Hubo un error al registrar. Por favor, intenta nuevamente.",
          "no_account": "¿No tienes una cuenta?",
          "register_here": "Regístrate aquí",
          "already_have_account": "¿Ya tienes una cuenta?",
          "login_here": "Inicia sesión aquí",
          "registration_success": "¡Registro exitoso! Redirigiendo al login...",
          "app_name": "Mi Aplicación",
          "Send recovery link": "Enviar enlace de recuperación",
          "Recover Password": "Recuperar Contraseña",
          "Forgot your password?": "¿Olvidaste tu contraseña?"
        }
      }
    },
    fallbackLng: "en", // Idioma por defecto
    interpolation: {
      escapeValue: false // React ya escapa por defecto
    }
  });

export default i18n;
