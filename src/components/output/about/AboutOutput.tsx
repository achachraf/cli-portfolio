import React from 'react';
import Image from "next/image";


const About = ({ about }:{about:About}) => {
  const {
    title,
    FullName,
    image,
    description,
    skills,
    contact,
    languages,
    interests,
  } = about;

  function getLink(url: string, text: string) {
    return  <a href={url} target="_blank" rel="noreferrer" className='hover:text-blue-400 transition'>{text}</a>
  }

  return (
    <div className="flex flex-col text-white p-4 rounded shadow-md">
      <div className="flex items-center mb-4">
        <Image className="w-20 h-20 rounded-full mr-4" src={image} alt="Achraf Achkari" />
        <div>
          <h2 className="text-xl font-bold">{FullName}</h2>
          <p className="">{title}</p>
        </div>
      </div>
      <p className=" mb-4">{description}</p>
      <h3 className="text-base font-bold mb-2">Skills</h3>
      <ul className="flex flex-wrap">
        {skills.map((skill) => (
          <li key={skill} className="px-2 py-1 rounded-full bg-gray-200 text-gray-600 mr-2 mb-2 hover:bg-black hover:border-white hover:border-solid hover:text-white transition">
            {skill}
          </li>
        ))}
      </ul>
      <h3 className="text-base font-bold mb-2">Contact</h3>
      <ul className="list-none mb-4">
        <li >
            {getLink(`mailto:${contact.email}`, contact.email)}
        </li>
        <li>
          {getLink(`tel:${contact.phone}`, contact.phone)}
        </li>
        <li >
            {getLink(contact.linkedin, 'LinkedIn')}
        </li>
        <li >
            {getLink(contact.github, 'Github')} 
        </li>
        <li>
          {contact.Address}
        </li>
      </ul>
      <h3 className="text-base font-bold mb-2">Languages</h3>
      <ul className="list-none mb-4">
        {languages.map((language) => (
          <li key={language.name}>
            {language.name} - {language.level}
          </li>
        ))}
      </ul>
      <h3 className="text-base font-bold mb-2">Interests</h3>
      <ul className="flex flex-wrap">
        {interests.map((interest) => (
          <li key={interest} className="mr-4 mb-2">
            {interest}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default About;