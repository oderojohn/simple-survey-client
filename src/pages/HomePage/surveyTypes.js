export const questionShape = {
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
      'short_text',
      'long_text',
      'email',
      'choice',
      'file'
    ]).isRequired,
    required: PropTypes.oneOf(['yes', 'no']),
    description: PropTypes.string,
    options: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.shape({
        multiple: PropTypes.oneOf(['yes', 'no']),
        choices: PropTypes.arrayOf(PropTypes.string)
      })
    ]),
    file_properties: PropTypes.shape({
      multiple: PropTypes.oneOf(['yes', 'no'])
    })
  };