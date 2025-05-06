const validateUsername = (username) => {
    const namePattern = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
    if (!username) {
      return { isValid: false, error: "Username is required." };
    } else if (username.length < 3) {
      return { isValid: false, error: "Username must be at least 3 characters." };
    } else if (!namePattern.test(username)) {
      return { isValid: false, error: "Username is not valid." };
    }
    return { isValid: true, error: "" };
  };
  
  const validatePassword = (password) => {
    if (!password) {
      return { isValid: false, error: "Password is required." };
    } else if (password.length < 6) {
      return {
        isValid: false,
        error: "Password must be at least 6 characters long.",
      };
    }
    return { isValid: true, error: "" };
  };
  
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      return { isValid: false, error: "Email is required." };
    } else if (!emailPattern.test(email)) {
      return { isValid: false, error: "Please enter a valid email address." };
    }
    return { isValid: true, error: "" };
  };
  
  const validateTermsAccepted = (termsAccepted) => {
    if (!termsAccepted) {
      return {
        isValid: false,
        error: "You must accept the Terms and Conditions.",
      };
    }
    return { isValid: true, error: "" };
  };
  
  export {
    validateEmail,
    validatePassword,
    validateTermsAccepted,
    validateUsername,
  };
  