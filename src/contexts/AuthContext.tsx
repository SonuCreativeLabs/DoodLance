const signUp = async () => ({
  error: {
    message: 'Authentication is disabled in this build.',
    status: 501,
  },
  data: null,
})

export { signUp }