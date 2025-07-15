"use client";

import Link from "next/link"
import Image from "next/image";

export default function Home() {

  return (
    // u-main-container is defined in globals.css 
    <div className="u-main-container u-padding-content-container">
      <h1 className="t-main-title underline">Test platform for MySQL</h1>
      <p className="t-main-subtitle">The idea is to code and test a few basic SQL access</p>
      <ul className="t-paragraph">
        <li className="flex items-center pl-4">
          <span className="pr-4 mr-auto text-cyan-500">Mise en place de l'application de test Netxt.js</span> 
          <p className=" text-green-600 rounded-full font-bold text-lg">X</p>
        </li>
        <li className="flex items-center pl-4 ">
          <span className="pr-4 mr-auto text-cyan-500">Mise en place d'un App context</span> 
          <p className=" text-red-500 rounded-full font-bold text-lg">X</p>
        </li>
        <li className="flex items-center pl-4 ">
          <span className="pr-4 mr-auto text-cyan-500">Connection / disconnection</span> 
          <p className=" text-red-500 rounded-full font-bold text-lg">X</p>
        </li>
        <li className="flex items-center pl-4 ">
          <span className="pr-4 mr-auto text-cyan-500">Select operations</span> 
          <p className=" text-red-500 rounded-full font-bold text-lg">X</p>
        </li>
        <li className="flex items-center pl-4 ">
          <span className="pr-4 mr-auto text-cyan-500">Insert</span> 
          <p className=" text-red-500 rounded-full font-bold text-lg">X</p>
        </li>
        <li className="flex items-center pl-4 ">
          <span className="pr-4 mr-auto text-cyan-500">Update</span> 
          <p className=" text-red-500 rounded-full font-bold text-lg">X</p>
        </li>
        <li className="flex items-center pl-4 ">
          <span className="pr-4 mr-auto text-cyan-500">Delete</span> 
          <p className=" text-red-500 rounded-full font-bold text-lg">X</p>
        </li>
      </ul>
      <p className="t-paragraph mt-8">
        O2 ne procure pas l'hébergement mongoDB. L'idée est donc d'utiliser ce bon vieux
        mySQL pour stocker les infos de Baboule. Puis d'héberger tout ça discrètement sur le site 
        du Ratoon. 
      </p>
      <p className="t-paragraph my-4">Il faudra aussi récupérer les datas de Baboule pour tout ce qui est nutrition. Et :</p>
        <ul className="t-paragraph">
          <li>Créer le schéma de la base</li>
          <li>Charger les données permanentes</li>
          <li>Coder des CRUD pour gérer tout ça !</li>
          <li>Déployer sur O2</li>
        </ul>
    </div>
  )
}
