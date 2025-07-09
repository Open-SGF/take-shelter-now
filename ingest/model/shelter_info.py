from dataclasses import dataclass

from model.shelter_category import ShelterCategory


@dataclass
class ShelterInfo:
    name: str
    address_line1: str
    address_line2: str
    city: str
    state: str
    zip: str
    latitude: str
    longitude: str
    capacity: int
    category: ShelterCategory
    pet_friendly: PetFriendlyCategory
