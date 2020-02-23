import React, { useRef } from 'react';
import { connect } from 'react-redux';
import Tooltip from './../Tooltip.js';

const DIMIcon = () => (
	<svg enableBackground="new 0 0 921 921" viewBox="0 0 921 921" xmlns="http://www.w3.org/2000/svg">
		<g fill="#ccc">
			<path d="m552.6 460.5-92.1-92.1-92.1 92.1 92.1 92.1z"/>
			<path d="m835.8 375.3-6.8-6.8-92.1-92.1-92.1-92.1-101.7-101.8-82.6-82.5-92.1 92.1 74.7 74.8 109.5 109.5 92.1 92.1 92.1 92.1-92.1 92.1-74.9 74.9-109.3 109.2-92.1-92.1-92.1-92.1-85-85-7.1-7.1 103.4-103.4 80.8-80.8-92.1-92.1-92.1 92.1-92.1 92.1-92.1 92.1 92.1 92.1 92.1 92.1 92.1 92.1 92.1 92.1 92.1 92.1 92.1-92.1 92.1-92.1 92.1-92.1 92.1-92.1 92.1-92.1-77.3-77.3z"/>
		</g>
	</svg>
)
const Wishlist = props => {

	const textAreaRef = useRef(null);
	
	function buildWishlistValue() {
		let weaponHash = props.weapon.hash;
		let perks = Object.values(props.weapon.perks).filter(perk => perk.hash !== 0 && perk);
		let mwHash = props.weapon.masterwork.hash;
		let wishlistItem = '';
		
		// Add the weapon hash
		wishlistItem = weaponHash !== 0 && `dimwishlist:item=${weaponHash}`;

		// Add perks
		wishlistItem = perks.length > 0 ? `${wishlistItem}&perks=` : wishlistItem
		perks.forEach((perk, index) => {
			wishlistItem = `${wishlistItem}${index === 0 ? perk.hash : ","+perk.hash}`;
		});

		// Add masterwork
		wishlistItem = mwHash !== 0 ? `${wishlistItem}${perks.length > 0 ? ','+mwHash : mwHash }` : wishlistItem

		return wishlistItem;
	}

  function copyToClipboard(e) {
    textAreaRef.current.select();
		document.execCommand('copy');
		e.target.focus();
  };

  return (
    <div className="current__wishlist">
      {
				document.queryCommandSupported('copy') && 
					<div
						data-for={`getContent-wishlist`} 
						data-tip>
							<button 
								onClick={copyToClipboard}>
									<DIMIcon />
							</button>
							<Tooltip 
								hash={`wishlist`}
								title={ 'DIM Wishlist' }
								description={ 'Export a DIM Wishlist item to your clipboard.' }
							/>
					</div>
      }
      <form>
        <textarea
					readOnly
					ref={textAreaRef}
					value={buildWishlistValue()}
        />
      </form>
    </div>
  );
}

const mapStateToProps = state => ({
	weapon: state.weapon,
});

export default connect(mapStateToProps, {

})(Wishlist);