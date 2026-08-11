const generateCollegeCode = (collegeName) => {
  const prefix = collegeName.replace(/\s+/g, "").substring(0, 3).toUpperCase();

  const random = Math.random().toString(36).substring(2, 7).toUpperCase();

  return `${prefix}-${random}`;
};

export default generateCollegeCode;
