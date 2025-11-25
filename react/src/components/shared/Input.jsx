import React from "react";

const Input = ({ type = "text", placeholder, id, title, name, value, onChange }) => {
	return (
		<>
			<label htmlFor={id} className="inputs">
				{title}
				<input type={type} id={id} value={value} name={name} placeholder={placeholder} onChange={onChange} />
			</label>
		</>
	);
};

export default Input;
