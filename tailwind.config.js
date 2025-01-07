module.exports = {
    darkMode: 'class',
    content: ['./pages/**/*.js', "./components/**/*.js", "./layouts/**/*.js", "./fragment/**/*.js"],
    theme: {
        extend: {
            spacing: {
                104: '26rem',
            },
            colors: {
                'C4': '#C4C4C4',
                '5A': '#5A5A5A',
                '6D': '#6D6D6D',
                '7D': '#7D7D7D',
                'F8': '#F8F8F8!important',
                primary: {"50":"#B00003","100":"#780002","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb",
                        "700":"#1d4ed8","800":"rgba(255, 0, 0, 0.58)","900":"#1e3a8a","950":"#172554", 'primary': '#e50004'}
            },

            animation: {
                ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
              },
            keyframes: {
                ping: {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '75%, 100%': { transform: 'scale(2)', opacity: '0' },
                },
            },
        },
    },
    fontFamily: {
        'body': [
      'Inter', 
      'ui-sans-serif', 
      'system-ui', 
      '-apple-system', 
      'system-ui', 
      'Segoe UI', 
      'Roboto', 
      'Helvetica Neue', 
      'Arial', 
      'Noto Sans', 
      'sans-serif', 
      'Apple Color Emoji', 
      'Segoe UI Emoji', 
      'Segoe UI Symbol', 
      'Noto Color Emoji'
    ],
        'sans': [
      'Inter', 
      'ui-sans-serif', 
      'system-ui', 
      '-apple-system', 
      'system-ui', 
      'Segoe UI', 
      'Roboto', 
      'Helvetica Neue', 
      'Arial', 
      'Noto Sans', 
      'sans-serif', 
      'Apple Color Emoji', 
      'Segoe UI Emoji', 
      'Segoe UI Symbol', 
      'Noto Color Emoji'
    ]},
  
    plugins: [],
}
