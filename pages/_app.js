import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Header></Header>
      <Component {...pageProps} />
    </div>
  )
}
function Header() {
  return (
    <div className={"fixed-header"}>
      <div className={"container"}>
        <nav>
          <a href="/">Home</a>
          <a href="/getListings">Annonser</a>
          <a href="/orders">Ordrar</a>
          <a href="/creatListing">Skapa Annons</a>
          <a className={"login"} href="/">login</a>
          
        </nav>
      </div>
    </div>
  )
}
export default MyApp
