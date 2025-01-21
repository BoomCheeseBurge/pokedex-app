function Header(props) {

    const { handleToggleSideMenu } = props;
    
    return (
        <header>
            <button className="open-nav-button" onClick={handleToggleSideMenu}>
                <i className="fa-solid fa-bars"></i>
            </button>

            <h1 className="text-gradient">Pokėdex</h1>
        </header>
    );
}

export default Header;