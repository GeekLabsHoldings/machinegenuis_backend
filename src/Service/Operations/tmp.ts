import BrandsModel from "../../Model/Operations/BrandCreation.model";
import { Types } from 'mongoose';
import { ISubBrand, IBrand } from "../../Model/Operations/IBrand_interface";
const AWS = require('aws-sdk');
const { Route53DomainsClient, CheckDomainAvailabilityCommand, GetDomainSuggestionsCommand } = require('@aws-sdk/client-route-53-domains');

// import { Request, Response } from 'express';



export const getAllBrands = async () => {
  return await BrandsModel.find({ type: { $ne: 'subbrand' } });
};

export const getBrandById = async (id: string) => {
  return await BrandsModel.findById(id);
};

export const createBrand = async (brandData: IBrand) => {
  const newBrand = new BrandsModel(brandData);
  return await newBrand.save();
};

export const updateBrand = async (id: string, brandData: Partial<IBrand>) => {
  return await BrandsModel.findByIdAndUpdate(id, brandData, { new: true });
};

export const deleteBrand = async (id: string) => {
  return await BrandsModel.findByIdAndDelete(id);
};

export const getAllSubBrands = async (parentId: string) => {
  return await BrandsModel.find({ type: 'subbrand', parentId });
};

export const getSubBrandById = async (parentId: string, id: string) => {
  return await BrandsModel.findOne({ _id: id, type: 'subbrand', parentId });
};

export const createSubBrand = async (parentId: string, subBrandData: ISubBrand) => {
  const newSubBrand = new BrandsModel({
    ...subBrandData,
    type: 'subbrand',
    parentId,
  });
  return await newSubBrand.save();
};

export const updateSubBrand = async (parentId: string, id: string, subBrandData: Partial<ISubBrand>) => {
  return await BrandsModel.findOneAndUpdate(
    { _id: id, type: 'subbrand', parentId },
    subBrandData,
    { new: true }
  );
};

export const deleteSubBrand = async (parentId: string, id: string) => {
  return await BrandsModel.findOneAndDelete({ _id: id, type: 'subbrand', parentId });
};





// Set AWS region and initialize Route53Domains
const client = new Route53DomainsClient({  region: process.env.AWS_REGION});

// Function to check domain availability
export async function checkDomainAvailability(domainName:string) {
  const command = new CheckDomainAvailabilityCommand({ DomainName: domainName });

  try {
      const result = await client.send(command);
      console.log(`Domain availability for "${domainName}": ${result.Availability}`);
      
      if (result.Availability === 'UNAVAILABLE') {
          console.log(`The domain "${domainName}" is not available. Fetching suggestions...`);
          const SuggestionsList = await getDomainSuggestions(domainName);
          return {SuggestionsList}
      }
      else{
        return {available:true}
      }
  } catch (error) {
      console.error("Error checking domain availability: ", error);
  }
}



// Function to get domain suggestions
async function getDomainSuggestions(domainName:string) {
  const command = new GetDomainSuggestionsCommand({
      DomainName: domainName,   // Domain name to base suggestions on
      SuggestionCount: 5,       // Number of suggestions to retrieve
      OnlyAvailable: true       // Return only available domain suggestions
  });

  try {
      const result = await client.send(command);
      console.log("Domain suggestions:", result.SuggestionsList);
      return result.SuggestionsList
  } catch (error) {
      console.error("Error fetching domain suggestions: ", error);
  }
}





// Placeholder for account-related functions
export const getAccount = async (id: string) => {
  // Implement account retrieval logic
  throw new Error('Not implemented');
};

export const addOrDeleteAccount = async (id: string, accountData: any) => {
  // Implement account addition or deletion logic
  throw new Error('Not implemented');
};


