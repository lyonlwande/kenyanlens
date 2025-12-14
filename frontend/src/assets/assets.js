import egaTradeLogo from './egaTradeLogo.png';
import kenyanLensLogo from './kenyanLensLogo.png';
import headerBackgroundGradient from './headerBackgroundGradient.jpg';
export const assets = {
	egaTradeLogo,
	kenyanLensLogo,
    headerBackgroundGradient,
};


export const blogCartegories = [
        'All',
        'Technology',
        'Health',
        'Travel',
        'Food',
        'Lifestyle',    
        'Education',
        'Finance',
        'Entertainment',
        'Sports',
        'Science',
];

// Mock blog data for UI design
export const blog_data = [
  {
    id: 1,
    title: 'The Future of AI in Kenya',
    description: 'Exploring how artificial intelligence is shaping industries and opportunities in Kenya.',
    category: 'Technology',
    image: 'https://img.freepik.com/free-photo/server-room-colleagues-use-artificial-intelligence-perform-computing-tasks_482257-125053.jpg?uid=R146517088&ga=GA1.1.1931360711.1753874614&semt=ais_incoming&w=740&q=80' 
    // Source: Unsplash, “yellow digital machine” in Nairobi :contentReference[oaicite:0]{index=0}
  },
  {
    id: 2,
    title: 'Healthy Living Tips for 2025',
    description: 'Simple and effective ways to improve your health and wellness this year.',
    category: 'Health',
    image: 'https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdG9yfGVufDB8fDB8fHww'
    // Source: Pexels (generic wellness / health image)
  },
  {
    id: 3,
    title: 'Top Travel Destinations in Kenya',
    description: 'Discover the most beautiful and exciting places to visit across Kenya.',
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhdmVsfGVufDB8fDB8fHww'
    // Source: Pixabay, “Africa Kenya Travel” :contentReference[oaicite:1]{index=1}
  },
  {
    id: 4,
    title: 'Kenyan Cuisine: A Foodie’s Guide',
    description: 'A look at the best dishes and culinary experiences Kenya has to offer.',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D'
    // Source: Pexels – Kenyan food / African cuisine
  },
  {
    id: 5,
    title: 'Balancing Work and Lifestyle',
    description: 'Tips for maintaining a healthy work-life balance in a fast-paced world.',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1531141445733-14c2eb7d4c1f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxpZmVzdHlsZXxlbnwwfHwwfHx8MA%3D%3D'
    // Source: Unsplash, lifestyle / city / work balance
  },
  {
    id: 6,
    title: 'Education Trends in Kenya',
    description: 'How technology and innovation are transforming education in Kenya.',
    category: 'Education',
    image: 'https://images.pexels.com/photos/4145192/pexels-photo-4145192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=400'
    // Source: Pexels – students / education
  },
  {
    id: 7,
    title: 'Personal Finance for Young Adults',
    description: 'Essential financial tips for young adults starting their careers.',
    category: 'Finance',
    image: 'https://images.pexels.com/photos/4386394/pexels-photo-4386394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=400'
    // Source: Pexels – money / finance
  },
  {
    id: 8,
    title: 'Entertainment Hotspots in Nairobi',
    description: 'Where to find the best entertainment and nightlife in Nairobi.',
    category: 'Entertainment',
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBEQACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAACAQMEBQYHAP/EAEEQAAEDAwIDBQUFBAgHAAAAAAECAwQABRESIQYxQRMiUWFxBzKBkaEUFUJSsSNiwdEWJCczcrLh8SY0NUNkZXT/xAAaAQACAwEBAAAAAAAAAAAAAAACAwABBAUG/8QAOxEAAgEDAgMFBgUBBwUAAAAAAAECAwQREiEFMUETIlFxoWGBscHR8BQjMpHhYiQzQlJygvEGFSU0Nf/aAAwDAQACEQMRAD8A5OBWI9MkEBUDSDFCGkKBVBpBVQSQVQNIUVQWBcVWS8C4qgsC1CYFxULwIRUKwJioTAmKsHB7FXkrAJFWC0CagDQhFWC0DioDgCjFJBAVQaCAoQ0GBUGYCAqg0ggKoJIUCqDwEBVF4JaLZOWlKkQ3ylQBSQ2dwahMoX7quG39Skb8v2Z3qbkyhmREkRsfaGHGs8tacVAlh8hrFUTAhFWTAmKgOBCKgLQhFXkpoEiiAaBNWCwcVAMDYFEJSDFCMQVUGkGKoNILFUMSCAqg8BAbVQSQoqBYO08NcU2GFwzAYkTmUSmIycjIJyCSBjPPJrVCpBQSZwLizuKlduK2b+/gWA4v4fbU221cmChpSA2subjACVY8E6frmr7WC2Qv8BcS7zju8/Ve/PyObe0OXEmzI7sSYzJBaQFdm4VlJSgJOSdzuOZ51nqNZO1ZxlGGmSxjPq8mR00vJswJipkHAhFWVgHFQFoQirBaBIq0A0CRRANA4qAYGhRCUGKoYkGkVQaR1ew8IcKos9hN4ZlvzLyCUOId0pbOnVg7jAHx38q0RhDCz1ONWu7l1J9m0lEruD+GeH5t64hZllyfb7egrYcbcKStIJ3yCAdh6UFOEXJrwNN3dV4Uqbj3XLmJxLw3Y2jw1cLO3IahXV1KFsPLyQMp65ODgnqemKqcI91rkw7a6rvtadR96K5lkxwdZF+0yVYzGX9gbiB1Lfaqzq0pPPOepouzj2unoKd9XVgqyfezjkis4tsXD/8ARWNfuHmZUZKpJYW0+vUTjO/M9U+PWl1IR0aommyubj8S6FZp7ZLLiu2cGcPMIiu22eqfIhdsy427lCVEEDVlQ6jPI0VSNKGzQm0rX1y24yWlPD+8DfDdi4Z/olbble4cl56ZN+y6mXSMEqUEkjI22361VOFPQpSXMO7ubv8AFTpUZJKKz0MvxtZmLDxJKt8RalMIIUjXzAIBxnrSasdE2kdLh9eVzbqpLmaQ8JWxfswF8aYX95BGsr7RWMB3SduXu07so9jq6nP/AB1VcR7Bvu5x6CcQcJ2y3ezuBdUMLTcXQyXFlxRHeBJ25eFSdOMaSl1Ktr6rVv3Sb7u/oMMcJwXfZe7feyV95AlaV9ocaA5pPd5cgaiprstXUud7UjxBUc93+CNYuGIVz9nl4uxbV94RH1dmvWcaEpQojHLkVb1UIKVNyDubudK9hS/wv55RC4yssG12vhx+C2pDk63pffJWTqWQnfflzPKpUiko4Ls61SrUqxk+T29TKEUo2tAmrQDQFEBgbAqxKDAqDEgwKHIxI6Xwo8ji/hFzhp9zs7nASp23u5xqHLTn4kHyIPSnw/Mjp6o5N1F2ldV0u7LmL7J460PcRRXyGFiJ2ThXsGzkg59Kqgt5ILi0lppSW+/0HOIZUBpvg+yw7gxOdgvp7VyOcoGVIxv571JtJRimS1p1G69aUcJpmhjK/tnmq/8ABH+RFMX/ALDMkv8A5Uf9RmLof7KIo/8AZr/VdJl/ce86Vuv/ACf+1fBEv2sN28otry5D33kIraG2Ep7nZ5USsnxzkVdzpwn1F8DdXMkl3c7v2k7hqA3ceArI05MZihq6h4KdPvkKV3B5nNFTjqpLzE3tV0r6o1HOY49EUvF0Fi9cZXdcu4MWrsQgJEzbte7+HHp9RSqsVOo98GyxrSt7OGmDnlvl08zSWPD/ALOosHP/ADFvmADzSoEVop70cexnOunp4hKp4SiB7RFAcGSYyfdiy2GBjyaST9SaqvtTaJwrLvYy8U38SREa/wCDmbNjClWBx4p/eUQf1zVxXc0+wXUl/a3W/rwV3svfaa4OeakaSzLuhjLCuRDjaUgfE4FBbvue80cXjJ3Sceajn9myi9qEdcSDwzEc99i3hpXqkJB/ShrrCivYaeEzU51pLq/qYCs512AasW0DVixoUYlBgVQxDiaEYkdU4JsFtRFsd4hT44facU5NLrmlWCkjQB4DfnzzWmnBbSRwr26quVSlKO3T9+YVgmxHuIuM3mX2+xeZXoVqAC9zy8akGtcwrmnNW9umtzn1i/61b/8A6Wv8wrJD9SPQ3P8Acz8n8DqUeUwPa9OcLzYSIgQVFYACglGR61sT/tDPNzhJcJjt/i+pS8WMNWjgSLaXZkd6UZqndLK9XdOo5+opdXu0tOTbw6Tr37qxi0sfRE/jmxG8pj3KPPhJbi28BSFud5RTqVgAVdenrw0+SEcLvo2zdOUXmUiBEfaTwDY0l1AUi7pWoFQyBqXuaCL/ACV5mqrF/wDcaq/ofwRXe0Zpb/FsxxtCljS3jQCfwCguN6hr4NiNmk/Fmn4YmtMW/hJpxxsBRlNOhSgNIIPPw3Ap9N92C8/mci+puVa4eOWl+qIPFE5ubwdcylxBcXeFkJChkgHAP0qqss035jLCm6d5TT/yfyaFu7R0cXx7R/VQy3bSgvgjKicd3V4AA7edNU/zFD2GB28naOvvvLl8zEwnvu/2eT0IdR9oj3lKkDUMkpCN/mKzxemk/M69WPa38HjZw+ORz2rz2bmbJKYWlSXYpcwDuNRBwfDnV3EtWlgcGpSpurCS5PH7ZOfkUg7LQJFWLYFQDA0BTDOg00LGoMUIxDgGapjUgwKHIxIdZUttxLjailaCFJUk7gjrVZwHpTWGPMR35OostOvY3UUIKseZNTdl5hBJZx6ApbJPd+lCNQ4GF6c6fpUwXqWcFhYYzL84/aP7ptBcWB1A2x9aKCyxVdyjDu82bCXxBEetzTEVIbU2ns8J2wBT6k9tjj2ltOVVqT5lBKi/eTHaOJBeUNl43/1rPzOw2oLbkZmqH4BIGP8ASoA0CasBgkDwqxbQ2aJAME1YplnD4cus6OmRHjAtL91S3Uo1eYCiMjzpig3yMc7qlCWmT3KMVC0OJoWMQYqhyHBVDEWNstUq4KV2KQlpPvvLOEJ+Pj5CqUWySqKHmWy5vD9iSlKG03KZgEqXulJ8k8v19adCm3tFZMFxdRjntp6V4LmTrPxtPlO9gzbEJSBlDbatGfTkK1fhq3RHKd/Zt97K89zRQ7q7Ebemz0PsEnuR0ZCvUgfrypc9VN4awNpUqV1HVF5+X8kCZxdH5KjFkKPvp0g/LNJc8m6Ns6e2SOZ1ruDLiYK1KkdmSvUjBI8iavTtqJ2z1aH4ZMWtE+DJjJntFoSWwtlzml5OOYPLPiOlFWpYjlGbhd+6lVQk8P4mpYecTEiMxf2kmQstNIwNyQcn0AyT6UqhDVJG/i1fsKEt93sjLKwTkAgHkDWfyO1HOlZAVUI0CasW0CasWwCKJC2WrUKPbY6Jl1RqeXhUeErPfH53OoT5cz6UxLCyzBOpKrLRT5dX8l7fgVs+bIuElUiW52jisDJAAAHIADYAeAqm292HTpxpx0xRAFEKiOChY1BpqhqL+02bVb3bzO0m3xzgoS4ApxWdk+Q8fL1o4UpS3SM1xfUqMtDlh/fqeudzfkgNONtsMYBSwG+6gdO7y+efSm5hTfe3ZijC4u45pd2Pi+bKxaWXH+2eLrysYwohKceG1Er7QsRiFHgOuWalR+7+R5+SqRpCkIbSkYSloadPp1pP4yrqy37jbLgVm6WhLD8c7/fsJrEhlTKmZEl9bahjDve0+GK0zu6VWOJ5TObS4LeWtRuk1JP3EF2ztF9QkXAQkuJ1MKdaVpcB5HPIVUdGDPXdxGTW23g8tEmzpTbrupqW4Q60ooWQRpOB9aTUznHgb7PQk55bb8Q7jxG9GgyrLJhsSoq92FuEhTJ5gpx4fDanxqZjho5Va001dcJY6lpw9JUzDedacZS5IjhkPuNnW0DkEJ6DUSMnGcDyrNGpoTiludqvY/ipwrSllLphe/8AkoZDDjDqmnUFC0HSpJ5g1laa2Z6CE4zipReUxk1RGCaIBg4ycCoLkXbLMewsCVPQl25KALERYyln99wePgn5+FPSVNZfM5c5yupaae0Fzfj7F9SilyHZUhx+Q4px1xWpa1HJUaFtvdmlQUFpjsiPUKYymjMsRxNCxqJERTaH0KeUEtpOVEnkBVxWWkStPRTcl0LTiviiXeobcRhtUa2s6ewTqIWsDO5GTjJPLJxgbmtXaRT0o89G0qOPbz6laCcAEk4AGc1hm8ts9ZQhopxXsDFAaEEKpjEGOdCGalUdLVit0hUiSG3kKQ5GfGWHU5OQFckHHInrXQpJ9mjyHEZRd1PZbPn1X1KbiHh+YY5uSSksJabC1K984GnUfDICfiabKOFqMVGupNUl1KmJarlcrc4+1EddYiDJf057vh548uQoEm90aJTjFqE2TIMlSkspQUoaHPbmeQP1+tJ1ypN6efideNONzGOv9Phyz5+Ply8S3uTTT0Ft5K0qfSNLhB3UOh+HL5UiW6y+Z0KT0zcFy6FCaWazzba3nEttIU44s4ShKclR8AKLGRc5JLLZdOIi8PNA60v3rbu4Cm4n83B8h8KdtT8/h/JzNU7t8sU/WX8fEz7zi3HFOOLUtaiSpSjkk+ZoM53NSiorCWEMmrQLAqxbGBRmVDiaFjUHgKSpKhkKGDUTw8hSgpxcZcmHpCgArcAg7+VTW85IraLgoZ2TyOilM2oMVQxBCqYxBjnVBmpvE96Pw1b4qHnGFtPJQ9odUj8JOMg+fWuo4uFOCZ4eTp3F3XnHddPh8jUXGSzBtgaQsJLic6lOEYAIAyrcgZUN98bk5ANNk9jm04ObyYm7TpjYcei3qYJDH7F+DMwlSUK2JSE91XqB4GlNPGcmyDg2oOKw+qM9He7EgDG3QVkccnoadXTyJbMtS0vJUTjAHPzoJxwsmuhWdSokLEiSJ0pEeK0XXlnZKcfxpcYtvCNdWtClFym8IsXJiLKy5EtxQuarKX5qTnT4oa8B4q5nptTc6No8/Ew9m7mSnV/T0j838kUSySSTzPOlmvbGENmrSAYBohTANWLGE0wyocTQsbENNCNQ4KoagwaEagwaEYghVDEyxgIaYSibLIS2lWUJJ3WR/AH9KdRp6nnwOfxC67OHZx5y2z4ZTKZ66qlMTG31d56QXhnluMH9BXVuXqSkjxvD26c5QlzwWlinuTLqwZ75cYZjOIcS4olKmgg5Sf51njlyNlfTGk9Kx/yFfHI8iJbZa2lpmpbUlJJyS2Nkk+Px861ypKNJuRzqVbtLmOhbZM+ylZOyd1HbfnWGMXN4jzOzKqqUdU9kaexWyHJQ229LcDhBU4htvOnfmVE4AG3+9PnYOT3lsKo8fVGDUKeW+rf7GqsLlhebfhW6HLfYcwHH1udmXR4Z2IT5Vpp8OpqO7OdccbuqlRS225bbfs8/UuJHA9jnRgIkdcR0jZaJBcwfMEnP0pE7KnyQ+lx27i05Ya8ML5HNr7aXbRLWytxDyAohLrfJWOYx0PlWCvbzovEj09jxClewcoc1zXgVRpKNbAJq0LYFWLYwDTDIhxJqh0QwaAYgxVDUw00LQ1MurVw/OuCgUoLbfMrKSTj/AAjf54pkKM58kZq/EKFD9Ulkm3BNosCNLjDkuT+ZzZIP+H+ea1fgKiWWjly47TlLClhexGNvN0duD2telKRslKRgAUcKEo7nPuL6nW2XIr0qIUFDmPrTGmlh8jJCSlJTXNeqLG2u63ktBZT2xLSyBySrY/Q0NKL7RD69RSoyxuyXd5XbS3ZKAEoz2TCR+FtOw+mKdc1Fq0YyhFhQkqfbKWG9l8xy2wX3I65SlJZZA70h33Wk/mPU+QHM7eJDaX5cM4w2ZbmfaVMZzjqQZkxLzKIFtZW1CBySr+9lK/M4f0TyHmd6pZb3AeEiXCdjQCFyguQ5z0doUoT8tz+nka1x7n6mJl3uQ5J4mmvIEdh1baVdQrf0oHUTeEWoY3Zb3fsodlgwVNATDh1075AwcZ8zn12FYeJVYtRprmj0P/T1tNSnXeyey9vXJQk1yj0zYCqsWwM1Ytsjg0ZlQ4k1QxMcFUxsSZbYUi4y24sRsuOrOAOg8z5VIwc5aYkq14UYOc3sjfwrRZOGoRlXItyZONlL5Z/cT19TXYoWMYby3Z5O94xWuG40+7H4+Zm7/wAbypoUzB/q8f8AKg4z6mtWpR5HLUPEyUiQt8nGpSlc1UqU9QyMcEVbXTGT+lKaCzkTsFjfB9aFxT2DjNxeUXVmt7fZ/bbgpSIzSu62k6VPKG/PoBtv8B1ITPTS35s6FCNa77qemK5/ftHocNNzmKlPH7NbkL0KXp1b9EoH4lHw8sms8m3mUjfTjGM406S26J/Fjd4uAuTiY0dhxm3sKPYR88z+ZR6k/wC1dGLysyPPyi1JqJDWVQ2wopwpXugnemRaS1ICUJJ6ZLDITaZE6QltpJWtRwEjegy5PYvaJrIMW38PNdq6ESrr+BPNDJ8+mR8/Sk1rmFFYjvL0OrY8Kq3LU6i0w9WVb7rjzq3XVla1qKlKJ5muQ25PLPXRjGEVGK2QyaiBYBNWLbAJoheRgGjMqYYNUMTHEbkAAk+AqsDE8Gxt8pvhuIppAQJzqQZTq/8AtjmGx/Hz9K7tlbRow1z5s8fxS+ldVdEP0r19pmL1dvt0lTr7ypCzsBnCQPCmVasehjhBpERiM5KIKwEoPupA50jeQzKRZJhxo7ffXqc6lPL0FDOrSprvM0ULK5uX+XHbx5IY7FlJOlHPxOc1zqt5KW0Fg9HacCpw71d6n4dPv9iREZckvtR46NTjighCR1JOAKx5lJ89zuflUafJKKJN3Qz3FyHQ1bYw7NvScLlrT7wb8s81chnqdq2Qh1Z5m7uW24x5vf8Af+DweelpYWttCFIAaiRmx3WU43xnmeWSedKqzb7qOjYW0aUe1qcwHo6I41PSGgTvoQrKvjttTaVjObzJ4QNzx2hSTVJNvp0RSLS7cZCuywED3nFbJSK6M3CEfCKPL06da6q7byf37iyYcTDaLUMFAIwtw++v49B5CubWu5T7sdl8T1Vlwmlb4lPvS9F5DJOayHUbBJqwGwCasW2ATRJC2wc1YvJHFGZUwwaoYmSoMn7G+JKUJWtoakJVy1dNuuOfwptDSqicjPfSn+Glo5/LqVkye9NfUt1RJUoqPmT410Z1ZT5nmIwUVsSIUXtCNXKqii2aCOiAMJfnONIBwoIZyr55xWS4nUzjOx2eHQtVDVJZl7d/QiSg0h4iO6XWvwrIwSKwSTTPSUqinHKGxv0NCOyaSxFNht0ziGe2cBosQ2+S1uuAgKHgAkLOflWihDfUzj8VuU4qjHfPPyXQyjKnr1cS9IUhKEAHA2Qy2OSUjoPLr6mnTlhYOda0dc8vc0rNvllCn46GkuFoiOyt5IcUOWrTnPyHXwpVGDc8s6F9cQhQdLOX97GZciTHJ7sJxtaFoWEOJHeUVeAxzPpXQnWjFew4FC0nWniPvfRFjcIS7Y8IqiydIz+xcC0+e46865depOcu8ersKVGlSxSX78399CITSjZkHNWC2CTVi2wSaJANgE1YtsDNWLyMg0ZlTCBqsDEwwccqENCoQ0F6y0gq8adGvJGOfDaE3tleRNb0lh9wDR2aQR1KiTy/WnU60psyXNjSoQTTbbIzSFHKntRbJ3TnGTQ1aiwXaWrnLngdQE+6nYdKxN5eT0NOMacVGJsLXw3BQ6FS7k0ezQVrJay22MagVHO+RghPMjGcA7tjRb3OdX4mo5jHn57+S29TNcT3g3uWzCt6XlR0L/Zhf948tWAVqA2yQAAOSQABT4nNqPfPX4Lw+r6ssbTb12h9lqc2kNhP2hxR3SoJyScjoMEepzQKLnLPRGtTjb0f6n6L7wZ9xyVfbmVuH9u8tSionHZ9efQCmrEFkxybrNQLqXeFFeIrbLakjT9pQgpccGMEnfAJ8QAcVjnUcnk71tZwoww9yrKqXg2ZBJqwcgk1AWwSaIBsAmrAbBJqxbYOagGRkGmGVBA1QyLCBqmg0wwd6EYmOaipotBQTqIOT5Z/nTac1HKZmuqMqulx6Dhc7gSnlzPmaXKWTRQpKnu+YrDiUPIU4nUgKBUnxGdxQGhttbHRZVxst4hMpZDezekdo8UOMj8qsEak88bnHhjlthOOOZ5i5tbhVHKUc+0qvuyy2CJMUtbZuCouWdMk5GobEY2z12PTG2c0upJYwjTZ0as3GUuWTLuzZTsNMFct4RArUWxvnr8s74pVOrpWGdW5s1Wlqi8DSFJaQpLIKQoYUSclXl6VU6rnsFb2kKPe5sDVSjZqEKqvBWoQqqYKcgSasByBJ3qwWwSasBsEmrAbBzVgZGhRGZBCqDCqBoUVQxBChDTCzUCCqgkwgfpVBJi52223qBHqmCz1TBMiVCsiGoUJVgs9UByAasFiGrAYBqwGJVgH/9k='
    // Source: Pexels – city nightlife / entertainment
  },
  {
    id: 9,
    title: 'Sports Achievements in Kenya',
    description: 'Celebrating Kenya’s top sports personalities and achievements.',
    category: 'Sports',
    image: 'https://i.pinimg.com/236x/59/1a/40/591a40b22dbe7aba1ccf55c48f0627a4.jpg'

  },
  {
    id: 10,
    title: 'Science Innovations in Africa',
    description: 'A look at groundbreaking scientific research and innovation in Africa.',
    category: 'Science',
    image: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=400'
    // Source: Pexels – lab, science
  },
];

export const footer_data = [
    {
        title: "Explore",
        links: ["Home", "Latest Posts", "Categories", "Popular Reads", "About Us"],
    },
    {
        title: "Community",
        links: ["Conversations", "Culture & Ideas", "Stories & Experiences", "Inspiration Hub"],
    },
    {
        title: "Support",
        links: ["Contact Us", "Privacy Policy", "Terms of Use", "Cookie Policy"],
    },
    {
        title: "Follow Us",
        links: ["Instagram", "Twitter", "Facebook", "YouTube"],
    },
];
