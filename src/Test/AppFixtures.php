<?php

declare(strict_types=1);

namespace App\Test;

use App\Entity\Device;
use App\Entity\Location;
use App\Entity\User;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Override;
use LongitudeOne\Spatial\PHP\Types\Geometry\Point;

class AppFixtures extends Fixture
{
    #[Override]
    public function load(ObjectManager $manager): void
    {
        $this->initSequences($manager);

        $user1 = new User();
        $user1->username = 'test1';
        $user1->email = 'test1@example.com';
        $user1->fullName = 'Test User1';
        $user1->password = 'secret';
        $user1->roles = [];

        $user2 = new User();
        $user2->username = 'test2';
        $user2->email = 'test2@example.com';
        $user2->fullName = 'Test User2';
        $user2->password = 'secret';
        $user2->roles = [];

        $user3 = new User();
        $user3->username = 'test3';
        $user3->email = 'test3@example.com';
        $user3->fullName = 'Test User3';
        $user3->password = 'secret';
        $user3->roles = [];

        $user4 = new User();
        $user4->username = 'demo';
        $user4->email = 'demo@example.com';
        $user4->fullName = 'Demo User';
        $user4->password = 'secret';
        $user4->roles = [];

        $user1->addFriend($user2);
        $manager->persist($user1);
        $manager->persist($user2);
        $manager->persist($user3);
        $manager->persist($user4);

        $device = new Device();
        $device->user = $user1;
        $device->name = 'my-device';
        $device->description = 'My Device';
        $manager->persist($device);

        $location = new Location();
        $location->device = $device;
        $location->timestamp = new DateTime('2024-07-16 00:00:00');
        $location->insertTimestamp = new DateTime('2024-07-16 00:00:00');
        $location->location = new Point(174, -40);
        $location->accuracy = 100;
        $location->speed = 100;
        $manager->persist($location);

        $manager->flush();
    }

    private function initSequences(ObjectManager $manager): void
    {
        $manager->getConnection()->executeStatement('ALTER SEQUENCE device_id_seq RESTART');
        $manager->getConnection()->executeStatement('ALTER SEQUENCE user_id_seq RESTART');
        $manager->getConnection()->executeStatement('ALTER SEQUENCE location_id_seq RESTART');
    }
}
