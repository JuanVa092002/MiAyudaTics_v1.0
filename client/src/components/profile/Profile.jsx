import React, { useContext } from 'react';
import { AuthContext } from '../../context/Auth.context';

export default function Profile() {
  const { user } = useContext(AuthContext);


  // Usa la URL de la foto directamente desde el campo user.foto.url
  const imageUrl = user.foto.url;

  console.log(user)

  return (
    <div className='flex bg-gray-100 hover:bg-white  py-[1px] pr-5 pl-1 rounded-full items-center'>
      <div className='mr-4'>
        <img src={imageUrl} alt="Imagen de perfil" className='w-9 h-9 rounded-full' />
      </div>
      <div className='text-sm text-azul-sena'>
        <p>{user.nombre}</p>
        <p>{user.rol}</p>
      </div>
    </div>
  );
}
