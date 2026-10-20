export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BX CLUB | Blackxcellencee — Olfactory Atelier</title>
        <link rel="shortcut icon" type="image/png" href="https://res.cloudinary.com/dzosy1sic/image/upload/w_32,h_32,c_fill/v1785715293/BX_CLUB_logo_oin4k5.png">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://js.stripe.com/v3/"></script>
      </head>
      <body>
        <!-- YOUR ENTIRE HTML BODY CONTENT GOES HERE -->
        <!-- (Copy everything from <body> to </body> from your HTML file) -->
        
        <script>
          // YOUR ENTIRE JAVASCRIPT GOES HERE
          // (Copy everything from <script> to </script> from your HTML file)
          // Make sure these two lines are at the top:
          const STRIPE_PUBLIC_KEY = 'pk_live_51UIkNGCFKrLmTsm1ReQRdelWGyckF0MskvUd4qbylqqw9igzw6yNsfsG0VfRm9Dff4hbTMvwe2dv8TwFQZfo9sbJ00f09qM9OW';
          const API_BASE_URL = 'https://bx-club-store.vercel.app';
        </script>
      </body>
      </html>
    `}} />
  )
}
