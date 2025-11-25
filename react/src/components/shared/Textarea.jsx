import React from "react";

const Textarea = ({ title, placeholder, id, value, name, onChange }) => {
	return (
		<label htmlFor={id}>
			{title}
			<textarea id={id} name={name} onChange={onChange} placeholder={placeholder} value={value} />
		</label>
	);
};

export default Textarea;
