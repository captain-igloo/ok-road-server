<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Exclude;
use Override;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_USERNAME', fields: ['username'])]
#[UniqueEntity(fields: ['username'], message: 'There is already an account with this username')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    public ?int $id = null;

    #[ORM\Column(length: 180)]
    public ?string $username = null;

    #[Exclude]
    #[ORM\Column]
    public ?string $email = null;

    #[ORM\Column]
    public ?string $fullName = null;

    /**
     * @var list<string> The user roles
     */
    #[Exclude]
    #[ORM\Column]
    public array $roles = [];

    /**
     * @var string The hashed password
     */
    #[Exclude]
    #[ORM\Column]
    public ?string $password = null;

    /**
     * @var Collection<int, Device>
     */
    #[Exclude]
    #[ORM\OneToMany(targetEntity: Device::class, mappedBy: 'user')]
    public Collection $devices;

    /**
     * @var Collection<int, self>
     */
    #[Exclude]
    #[ORM\ManyToMany(targetEntity: self::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'friend')]
    #[ORM\JoinColumn(name: 'friend_id')]
    public Collection $friends;

    /**
     * @var Collection<int, self>
     */
    #[Exclude]
    #[ORM\ManyToMany(targetEntity: self::class, mappedBy: 'friends')]
    public Collection $users;

    public function __construct()
    {
        $this->devices = new ArrayCollection();
        $this->friends = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    #[Override]
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    #[Override]
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    #[Override]
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @see UserInterface
     */
    #[Override]
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function addDevice(Device $device): static
    {
        if (!$this->devices->contains($device)) {
            $this->devices->add($device);
            $device->user = $this;
        }

        return $this;
    }

    public function removeDevice(Device $device): static
    {
        if ($this->devices->removeElement($device)) {
            // set the owning side to null (unless already changed)
            if ($device->user === $this) {
                $device->user = null;
            }
        }

        return $this;
    }

    public function addFriend(self $friend): static
    {
        if (!$this->friends->contains($friend)) {
            $this->friends->add($friend);
        }

        return $this;
    }

    public function removeFriend(self $friend): static
    {
        $this->friends->removeElement($friend);

        return $this;
    }

    public function addUser(self $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->addFriend($this);
        }

        return $this;
    }

    public function removeUser(self $user): static
    {
        if ($this->users->removeElement($user)) {
            $user->removeFriend($this);
        }

        return $this;
    }
}
