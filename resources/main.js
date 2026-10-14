/* Medik | javascript file */

$( function () {

	/*
	 * Site navigation
	 * adds proper Bootstrap CSS class to links added via mw.util.addPortletLink()
	 */
	function medikNavigation() {
		$( '#p-personal li a:not(.dropdown-item), aside li a:not(.dropdown-item)' )
			.addClass( 'dropdown-item' );
		$( '#mw-navigation li a:not(.nav-link)' )
			.addClass( 'nav-link' );
	}

	/*
	 * Hide aside menu with no dropdown items
	 */
	function hideAsideDropdown() {
		$( 'aside .dropdown' ).has( 'div:empty' ).hide();
	}

	/*
	 * Remove echo notifications popup on smaller screens
	 */
	function medikRemoveEchoPopup() {
		if ( $( window ).width() <= 650 ) {
			$( 'a.mw-echo-notifications-badge' ).off( 'click' );
		}
	}

	/*
	 * Hamburger menu
	 * opens navigation sidebar and login/user menu
	 */
	function medikTogglehamb() {
		$( '#mw-navigation nav' ).toggle( 'fast' );
	}

	/* Move the page TOC into the sidebar on desktop and restore it on mobile. */
	function medikSidebarToc() {
		const toc = document.getElementById( 'toc' );
		const sidebarToc = document.getElementById( 'sidebar-toc' );
		if ( !toc || !sidebarToc ) {
			return;
		}

		const originalPosition = document.createComment( 'Medik TOC position' );
		toc.parentNode.insertBefore( originalPosition, toc );
		const sidebarLogo = document.querySelector( '#site-navigation .mw-wiki-navigation-logo' );
		const logoPosition = sidebarLogo ? document.createComment( 'Medik logo position' ) : null;
		if ( sidebarLogo ) {
			sidebarLogo.parentNode.insertBefore( logoPosition, sidebarLogo );
		}
		const desktop = window.matchMedia( '(min-width: 768px)' );
		const headings = Array.from( document.querySelectorAll(
			'#bodyContent h2, #bodyContent h3, #bodyContent h4, #bodyContent h5, #bodyContent h6'
		) ).map( ( heading ) => ( {
			id: heading.id || heading.querySelector( '.mw-headline' )?.id,
			element: heading
		} ) ).filter( ( heading ) => heading.id );

		function updatePosition() {
			if ( desktop.matches ) {
				if ( sidebarLogo ) {
					sidebarToc.parentNode.insertBefore( sidebarLogo, sidebarToc );
				}
				sidebarToc.appendChild( toc );
			} else {
				if ( sidebarLogo ) {
					logoPosition.parentNode.insertBefore( sidebarLogo, logoPosition.nextSibling );
				}
				originalPosition.parentNode.insertBefore( toc, originalPosition.nextSibling );
			}
		}

		function updateActiveHeading() {
			if ( !desktop.matches ) {
				return;
			}
			let active = headings[ 0 ];
			for ( const heading of headings ) {
				if ( heading.element.getBoundingClientRect().top <= 100 ) {
					active = heading;
				} else {
					break;
				}
			}
			toc.querySelectorAll( 'a.active' ).forEach( ( link ) => link.classList.remove( 'active' ) );
			if ( active ) {
				const link = Array.from( toc.querySelectorAll( 'a[href*="#"]' ) ).find(
					( item ) => decodeURIComponent( item.hash.slice( 1 ) ) === active.id
				);
				link?.classList.add( 'active' );
			}
		}

		updatePosition();
		updateActiveHeading();
		desktop.addEventListener( 'change', () => {
			updatePosition();
			updateActiveHeading();
		} );
		window.addEventListener( 'scroll', updateActiveHeading, { passive: true } );
	}

	/*
	 * Start functions from the wrapper
	 */

	// immediately
	medikNavigation();
	medikSidebarToc();
	medikRemoveEchoPopup();
	hideAsideDropdown();
	$( '.mw-hamb' ).on( 'click', medikTogglehamb );

	// repeat every 1 s for 10 s after DOM content loaded
	window.medikVarI = 0;
	window.medikTimer = window.setInterval( function () {
		medikNavigation();
		medikRemoveEchoPopup();
		window.medikVarI++;
		if ( window.medikVarI === 10 ) {
			window.clearInterval( window.medikTimer );
		}
	}, 1000 );

} );
